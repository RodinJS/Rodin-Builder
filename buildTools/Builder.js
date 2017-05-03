const errors = require('./buildErrors');
const path = require('path');
const fs = require('fs-extra');
const request = require('request');
const iconProcess = require('./iconProcess');
const configs = require('../config/config');
const Logger = require("../logger/Logger");
const sendHook = require('../utils/sendHook');

class Builder {
    constructor (project) {
        this.project = project;
        this.logger = new Logger(`builds/${configs.platform}/${this.project.buildId}.log`, false);
    }

    init (cb) {
        const project = this.project;
        this.logger.info('Build start');
        this.logger.info(project);
        if (project.canceled)
            return cb('cancelled');

        const tempProjectPath = path.join(configs.builder.userDir, configs.builder.projectsDir, configs.builder.tempProjectName);
        const projectPath = path.join(configs.builder.userDir, configs.builder.projectsDir, project.userId, project.appId);

        project.tempProjectPath = tempProjectPath;
        project.projectPath = projectPath;

        fs.stat(projectPath, (err, status) => {
            if (status) {
                try {
                    fs.removeSync(projectPath);
                    this.logger.info(`folder removed: ${projectPath}`);
                } catch (err) {
                    this.logger.info(err);
                    return cb(new errors.RMDIRError(projectPath, 'init'));
                }
            }

            fs.mkdirp(projectPath, err => {
                if (err) {
                    this.logger.info(err);
                    return cb(new errors.MKDIRError(projectPath, 'init'));
                }

                this.logger.info(`folder created: ${projectPath}`);
                return cb();
            });
        });
    };

    copyTemplate (cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        fs.copy(project.tempProjectPath, project.projectPath, (err) => {
            if (err) {
                this.logger.info(err);
                return cb(new errors.CopyError(project.tempProjectPath, project.projectPath, 'copy'));
            }

            this.logger.info(`copy to folder: ${project.projectPath}`);
            return cb();
        });
    };

    clean (cb) {
        return cb();
    }

    setupBuild (cb) {
        return cb();
    }

    setupProject (cb) {
        return cb();
    }

    build (cb) {
        return cb();
    }

    rename (cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        const oldPath = this.project.binaryPath;
        const newPath = path.join(path.dirname(oldPath), this.project.appName + path.extname(oldPath));
        fs.rename(oldPath, newPath, err => {
            if (err) {
                return cb(err);
            }

            this.project.binaryPath = newPath;
            return cb();
        });
    }

    iconProcess (cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        return iconProcess(this.project)(cb);
    }

    sendHook (cb) {
        if(!this.project.built) {
            return cb();
        }

        this.logger.info("Sending hook");
        // sendHook(this.project, (err) => {
        //     if(err) {
        //         this.logger.info("Error while sending hook");
        //         this.logger.info({err});
        //         return cb();
        //     }
        //
        //     this.logger.info("Hook sent success");
        //     return cb();
        // });

        console.log('asdasdasdasdasdasdasdas');
        request(
            {
                method: 'POST',
                preambleCRLF: true,
                postambleCRLF: true,
                uri: `${configs.binSender.url[configs.envirement.mode()]}/${app.appId}/${configs.platform}`,
                json: {
                    buildId: app.buildId,
                    buildStatus: app.built,
                    error: app.errors
                },
                headers: {
                    'x-access-token': configs.binSender.token
                }
            },
            (err, response, body) => {
                if (!err && response.statusCode === 200) {
                    return cb();
                }

                return cb({err, statusCode: response.statusCode, body})
            }
        );
    }
}

module.exports = Builder;