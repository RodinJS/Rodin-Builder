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
                            this.logger.info("Cert Copy error");
                            this.logger.info(err);
                            return done(new errors.CopyError(cert.path, newPath, 'setupbuild'));
                        }

                        const cmd = `security import ${newPath} -k ~/Library/Keychains/login.keychain -P ${project.ios.certPassword} -T /usr/bin/codesign`;
                        this.logger.info(`Executing command "${cmd}"`);
                        child_process.exec(cmd, (err, stdout, etderr) => {
                            if (err) {
                                this.logger.info("Cert inport error");
                                this.logger.info(err);
                                return done(new errors.CertImportError());
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
                            this.logger.info("File Read error");
                            this.logger.info(err);
                            return done(new errors.FileReadError(profile.path, 'setupbuild'));
                        }

                        let uuidRegExp = new RegExp(configs.builder.uuidRegExp);
                        let uuNameRegExp = new RegExp(configs.builder.uuNameRegExp);
                        let uuDevelopmentTeamRegExp = new RegExp(configs.builder.uuDevelopmentTeamRegExp);
                        try {
                            project.ios.uuid = uuidRegExp.exec(content)[1];
                            project.ios.uuName = uuNameRegExp.exec(content)[1];
                            project.ios.uuDevelopmentTeam = uuDevelopmentTeamRegExp.exec(content)[1];
                        } catch (ex) {
                            this.logger.info('Profile Content error');
                            this.logger.info(err);
                            return done(new errors.ProfileContentError());
                        }

                        const newPath = path.join(path.join(configs.builder.userDir, configs.builder.libDir), project.ios.uuid + '.mobileprovision');
                        fs.copy(profile.path, newPath, err => {
                            if (err) {
                                this.logger.info("Profile Copy error");
                                this.logger.info(err);
                                return done(new errors.CopyError(profile.path, newPath, 'setupbuild'));
                            }

                            return done();
                        })
                    });
                }
            ],
            cb
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
                this.logger.info("Plist Read error");
                this.logger.info(err);
                return cb(new errors.FileReadError(plistFilePath, 'setupproject'));
            }

            content = content.replace('REPLACE_URL', project.url);
            content = content.replace('REPLACE_NAME', project.appName);
            content = content.replace('REPLACE_VERSION_STRING', project.version);

            fs.writeFile(plistFilePath, content, 'utf-8', (err) => {
                if (err) {
                    this.logger.info("Plist Write error");
                    this.logger.info(err);
                    return cb(new errors.FileWriteError(plistFilePath, 'setupproject'));
                }

                this.logger.info("Plist change success");
                fs.readFile(xbprojPath, 'utf-8', (err, xbproj) => {
                    if (err) {
                        this.logger.info("xbproj Read error");
                        this.logger.info(err);
                        return cb(new errors.FileReadError(xbprojPath, 'setupproject'));
                    }

                    xbproj = xbproj.replace('REPLACE_DEVELOPMENT_TEAM', project.ios.uuDevelopmentTeam);
                    xbproj = xbproj.replace('REPLACE_UUID', project.ios.uuid);
                    xbproj = xbproj.replace('REPLACE_UUNAME', project.ios.uuName);
                    xbproj = xbproj.replace('REPLACE_BUNDLE_IDENTIFIER', project.ios.bundleIdentifier);

                    fs.writeFile(xbprojPath, xbproj, 'utf-8', (err) => {
                        if (err) {
                            this.logger.info("xbproj Write error");
                            this.logger.info(err);
                            return cb(new errors.FileWriteError(xbprojPath, err));
                        }

                        this.logger.info('xbproj change success');

                        fs.readFile(exportOptionsPath, 'utf-8', (err, exportOptions) => {
                            if (err) {
                                this.logger.info("exprtOptions Read error");
                                this.logger.info(err);
                                return cb(new errors.FileReadError(exportOptionsPath, 'setupproject'));
                            }

                            exportOptions = exportOptions.replace('REPLACE_METHOD', project.ios.exportMethod);
                            exportOptions = exportOptions.replace('REPLACE_DEVELOPMENT_TEAM', project.ios.uuDevelopmentTeam);

                            fs.writeFile(exportOptionsPath, exportOptions, 'utf-8', (err) => {
                                if (err) {
                                    this.logger.info("exportOptions Write error");
                                    this.logger.info(err);
                                    return cb(new errors.FileWriteError(exportOptionsPath, 'setupproject'));
                                }

                                this.logger.info('exportOptions change success');
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
        const cmd = `sh build.sh ${ipaName} ${project.projectPath}`;
        this.logger.info(`Executing command "${cmd}"`)
        child_process.exec(cmd, {cwd: path.join(configs.builder.userDir, configs.builder.projectsDir)}, (err, stdout, stderr) => {
            if (stdout.match(new RegExp('EXPORT SUCCEEDED'))) {
                this.logger.info("Build success");
                project.built = 'success';
                project.binaryPath = path.join(project.projectPath, configs.builder.buildDir, 'Rodin.ipa');
                return cb();
            }

            this.logger.info("Build error");
            this.logger.info({err, stdout, stderr});
            project.built = 'failed';
            return cb(new errors.BuildError(stdout, stderr));
        });
    }
}

module.exports = IOSBuilder;
