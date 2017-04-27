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

        const cmd = './gradlew clean';
        this.logger.info(`Executing command "${cmd}"`);
        child_process.exec(cmd, {cwd: project.projectPath}, (err, stdout, stderr) => {
            if (stdout.match(new RegExp('BUILD SUCCESSFUL'))) {
                this.logger.info("Clean Success");
                return cb();
            }

            this.logger.info("Clean Failed");
            this.logger.info({err, stdout, stderr});
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

        this.logger.info(`Executing command "${cmd}"`);
        child_process.exec(cmd, {cwd: project.projectPath}, (err, stdout, stderr) => {
            if(err) {
                this.logger.info({err, stdout, stderr});
                this.logger.info({stdout, stderr});

                // todo: fix this;
                return cb(new Error());
            }

            this.logger.info("keyStore Success");
            project.keyStorePath = path.join(project.projectPath, `${keyStore.name}.keystore`);
            return cb();
        });
    }

    build(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

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

        this.logger.info(`Executing command "${cmd}"`);
        child_process.exec(cmd, {cwd: project.projectPath}, (err, stdout, stderr) => {
            if (stdout.match(new RegExp('BUILD SUCCESSFUL'))) {
                project.built = 'success';
                project.binaryPath = path.join(project.projectPath, configs.builder.buildDir, 'app-rodin-release.apk');
                this.logger.info("Build Success");
                return cb();
            }

            project.built = 'failed';
            this.logger.info("Build Failed");
            this.logger.info({err, stdout, stderr});
            return cb(new errors.BuildError(stdout, stderr));
        });
    }
}

module.exports = AndroidBuilder;
