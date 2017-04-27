const path = require('path');
const fs = require('fs-extra');
const request = require('request');
const child_process = require('child_process');
const iconProcess = require('./iconProcess');
const configs = require('../config/config');
const Builder = require('./Builder');
const errors = require('./buildErrors');

class ViveBuilder extends Builder {
    constructor(project) {
        super(project);
    }

    setupProject(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        const jsonFilePath = path.join(project.projectPath, "xul", "chrome", "content", "hello.xul");
        project.xulFilePath = "xul/chrome/content/hello.xul";
        project.uxtFilePath = "RodinData/data.uxt";
        project.exeFilePath = "RodinLauncherVive.exe";

        fs.readFile(jsonFilePath, "utf-8", (err, content) => {
            if (err) {
                this.logger.info("File Read error");
                this.logger.info(err);
                return cb(new errors.FileReadError(jsonFilePath, 'setupProject'));
            }

            content = content.replace("%appurl%", project.url);
            fs.writeFile(jsonFilePath, content, 'utf-8', (err) => {
                if (err) {
                    this.logger.info("File Write error");
                    this.logger.info(err);
                    return cb(new errors.FileWriteError(jsonFilePath, 'setupProject'));
                }

                this.logger.info("Xul change success");

                const exeName = project.vive.store ? 'RodinLauncherVive_Store.exe':'RodinLauncherVive_Local.exe';

                fs.rename(path.join(project.projectPath, exeName), path.join(project.projectPath, 'RodinLauncherVive.exe'), (err) => {
                    if(err) {
                        this.logger.info("File Write Error");
                        this.logger.info(err);
                        return cb(new errors.FileWriteError(jsonFilePath, 'RodinLauncherVive.exe'));
                    }

                    fs.writeFile(path.join(project.projectPath, project.uxtFilePath), project.vive.jsonData, 'ascii', (err) => {
                        if(err) {
                            this.logger.info("File Write error");
                            this.logger.info(err);
                            return cb(new errors.FileWriteError(jsonFilePath, project.uxtFilePath));
                        }

                        return cb();
                    });
                });
            });
        });
    }

    build(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        const cmd = `zip -r Rodin.zip ${project.xulFilePath} ${project.uxtFilePath} ${project.exeFilePath}`;
        this.logger.info(`Executing command "${cmd}"`);
        child_process.exec(cmd, {cwd: project.projectPath}, (err, stdout, stderr) => {
            if (err || stdout.match(new RegExp('error'))) {
                this.logger.info("Build Failed");
                this.logger.info({err, stdout, stderr});
                project.built = 'failed';
                return cb(new errors.BuildError(stdout, stderr));
            }

            this.logger.info("Build Success");
            project.built = 'success';
            project.binaryPath = path.join(project.projectPath, configs.builder.buildDir, 'Rodin.zip');
            return cb();
        });
    }
}

module.exports = ViveBuilder;
