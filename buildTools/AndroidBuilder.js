const path = require('path');
const fs = require('fs-extra');
const request = require('request');
const child_process = require('child_process');
const iconProcess = require('./iconProcess');
const configs = require('../config/config');
const Builder = require('./Builder');
const errors = require('./buildErrors');

class AndroidBuilder extends Builder {
    constructor(project) {
        super(project);
    }

    clean(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        child_process.exec('./gradlew clean', {cwd: project.projectPath}, (err, stdout, stderr) => {
            if (stdout.match(new RegExp('BUILD SUCCESSFUL'))) {
                project.built = 'success';
                console.log(`build status: ${project.built}`);
                return cb();
            }

            project.built = 'failed';
            console.log(`build status: ${project.built}`);
            return cb(new errors.CleanError(stdout, stderr));
        });
    }

    setupBuild(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        const keyStore = project.android.keyStore;

        const cmdParams = [
            `-genkey`,
            `-noprompt`,
            `-alias ${keyStore.alias}`,
            `-keypass ${keyStore.aliasPassword}`,
            `-keystore ${keyStore.name}.keystore`,
            `-storepass ${keyStore.password}`,
            `-dname "CN=mqttserver.ibm.com, OU=ID, O=IBM, L=Hursley, S=Hants, C=GB"`
        ];
        const cmd = `keytool ${cmdParams.join(" ")}`;

        child_process.exec(cmd, {cwd: project.projectPath}, (err, stdout, stderr) => {
            console.log('stdout', stdout);
            console.log('stderr', stderr);
            console.log('keyStore generate success');
            project.keyStorePath = path.join(project.projectPath, `${keyStore.name}.keystore`);
            return cb();
        });
    }

    // setupProject(cb) {
    //     const project = this.project;
    //     if (project.canceled)
    //         return cb('cancelled');
    //
    //     const gradleFilePath = path.join(project.projectPath, 'app', 'build.gradle');
    //     fs.readFile(gradleFilePath, 'utf-8', (err, content) => {
    //         if (err) {
    //             return cb(err);
    //         }
    //
    //         content = content.replace('RELEASE_STORE_FILE', project.keyStorePath);
    //         content = content.replace('RELEASE_STORE_PASSWORD', project.android.keyStore.password);
    //         content = content.replace('RELEASE_KEY_ALIAS', project.android.keyStore.alias);
    //         content = content.replace('RELEASE_KEY_PASSWORD', project.android.keyStore.aliasPassword);
    //         content = content.replace('REPLACE_PACKAGE', project.android.package);
    //         content = content.replace('REPLACE_VERSION', project.version);
    //         content = content.replace('REPLACE_URL', project.url);
    //         content = content.replace('REPLACE_NAME', project.appName);
    //
    //         fs.writeFile(gradleFilePath, content, 'utf-8', (err) => {
    //             if (err) {
    //                 return cb(err);
    //             }
    //
    //             console.log('gradle change success');
    //             return cb();
    //         })
    //     });
    // }

    build(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        console.log('keysotrepath', project.keyStorePath);
        const cmdParams = [
            `-PRReleaseStoreFile="${project.keyStorePath}"`,
            `-PRReleaseStorePassword="${project.android.keyStore.password}"`,
            `-PRReleaseStoreKeyAlias="${project.android.keyStore.alias}"`,
            `-PRReleaseStoreKeyPassword="${project.android.keyStore.aliasPassword}"`,
            `-PRApplicationID="${project.android.package}"`,
            `-PRVersionName="${project.version}"`,
            `-PRVersionCode=${1}`,
            `-PRURL="${project.url}"`,
            `-PRName="${project.appName}"`
        ];

        const cmd = `./gradlew assembleRodinRelease ${cmdParams.join(" ")}`;

        child_process.exec(cmd, {cwd: project.projectPath}, (err, stdout, stderr) => {
            if (stdout.match(new RegExp('BUILD SUCCESSFUL'))) {
                project.built = 'success';
                project.binaryPath = path.join(project.projectPath, configs.builder.buildDir, 'app-rodin-release.apk');
                console.log(`build status: ${project.built}`);
                return cb();
            }

            project.built = 'failed';
            console.log(`build status: ${project.built}`);
            return cb(new errors.BuildError(stdout, stderr));
        });
    }
}

module.exports = AndroidBuilder;
