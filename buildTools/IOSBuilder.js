const path = require('path');
const fs = require('fs-extra');
const request = require('request');
const child_process = require('child_process');
const iconProcess = require('./iconProcess');
const configs = require('../config/config');
const Builder = require('./Builder');
const errors = require('./buildErrors');
const async = require('async');

class IOSBuilder extends Builder {
    constructor(project) {
        super(project);
    }

    setupBuild(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        async.parallel(
            [
                done => {
                    const newPath = path.join(project.projectPath, 'Cert.p12');
                    if (!project.files.cert || project.files.cert.length !== 1) {
                        return done(new Error('cert does not provided'));
                    }

                    const cert = project.files.cert[0];
                    fs.copy(cert.path, newPath, err => {
                        if (err) {
                            return done(err);
                        }

                        child_process.exec(`security import ${newPath} -k ~/Library/Keychains/login.keychain -P ${project.ios.certPassword} -T /usr/bin/codesign`, (err, stdout, etderr) => {
                            if (err) {
                                return done(err);
                            }

                            return done();
                        });
                    });
                },
                done => {
                    if (!project.files.profile || project.files.profile.length !== 1) {
                        return done(new Error('profile does not provided'));
                    }

                    const profile = project.files.profile[0];
                    fs.readFile(profile.path, 'utf-8', (err, content) => {
                        if (err) {
                            return done(err);
                        }

                        project.ios.uuid = configs.builder.uuidRegExp.exec(content)[1];
                        configs.builder.uuidRegExp.lastIndex = 0;
                        project.ios.uuName = configs.builder.uuNameRegExp.exec(content)[1];
                        configs.builder.uuNameRegExp.lastIndex = 0;
                        project.ios.uuDevelopmentTeam = configs.builder.uuDevelopmentTeamRegExp.exec(content)[1];
                        configs.builder.uuDevelopmentTeamRegExp.lastIndex = 0;

                        fs.copy(profile.path, path.join(path.join(configs.builder.userDir, configs.builder.libDir), project.ios.uuid + '.mobileprovision'), err => {
                            if (err) {
                                return done(err);
                            }

                            return done();
                        })
                    });
                }
            ],
            err => {
                if (err) {
                    return cb(err);
                }

                return cb();
            }
        );
    }

    setupProject(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        const plistFilePath = path.join(project.projectPath, 'Rodin', 'info.plist');
        const xbprojPath = path.join(project.projectPath, 'Rodin.xcodeproj', 'project.pbxproj');
        const exportOptionsPath = path.join(project.projectPath, 'exportOptions.plist');

        fs.readFile(plistFilePath, 'utf-8', (err, content) => {
            if (err) {
                return cb(err);
            }

            content = content.replace('REPLACE_URL', project.url);
            content = content.replace('REPLACE_NAME', project.appName);
            content = content.replace('REPLACE_VERSION_STRING', project.version);

            fs.writeFile(plistFilePath, content, 'utf-8', (err) => {
                if (err) {
                    return cb(err);
                }

                console.log('plist change success');
                fs.readFile(xbprojPath, 'utf-8', (err, xbproj) => {
                    if (err) {
                        return cb(err);
                    }

                    xbproj = xbproj.replace('REPLACE_DEVELOPMENT_TEAM', project.ios.uuDevelopmentTeam);
                    xbproj = xbproj.replace('REPLACE_UUID', project.ios.uuid);
                    xbproj = xbproj.replace('REPLACE_UUNAME', project.ios.uuName);
                    xbproj = xbproj.replace('REPLACE_BUNDLE_IDENTIFIER', project.ios.bundleIdentifier);

                    fs.writeFile(xbprojPath, xbproj, 'utf-8', (err) => {
                        if (err) {
                            return cb(err);
                        }

                        console.log('xbproj change success');

                        fs.readFile(exportOptionsPath, 'utf-8', (err, exportOptions) => {
                            if (err) {
                                return cb(err);
                            }

                            exportOptions = exportOptions.replace('REPLACE_METHOD', project.ios.exportMethod);
                            exportOptions = exportOptions.replace('REPLACE_DEVELOPMENT_TEAM', project.ios.uuDevelopmentTeam);

                            fs.writeFile(exportOptionsPath, exportOptions, 'utf-8', (err) => {
                                if (err) {
                                    return cb(err);
                                }

                                console.log('exportOptions change success');
                                return cb();
                            });
                        });
                    });
                });
            });
        });
    }

    build(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        const ipaName = `app-rodin-release-${Date.now()}`;
        child_process.exec(`sh build.sh ${ipaName} ${project.projectPath}`, {cwd: path.join(configs.builder.userDir, configs.builder.projectsDir)}, (err, stdout, stderr) => {
            if (stdout.match(new RegExp('EXPORT SUCCEEDED'))) {
                project.built = 'success';
                project.binaryPath = path.join(project.projectPath, configs.builder.buildDir, 'Rodin.ipa');
                console.log(`build status: ${project.built}`);
                return cb();
            }

            project.built = 'failed';
            console.log(`build status: ${project.built}`);
            return cb(new errors.BuildError(stdout, stderr));
        });
    }
}

module.exports = IOSBuilder;
