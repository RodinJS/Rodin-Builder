const path = require('path');
const fs = require('fs-extra');
const request = require('request');
const child_process = require('child_process');
const iconProcess = require('./iconProcess');
const configs = require('../config/config');
const Builder = require('./Builder');
const errors = require('./buildErrors');

class OculusBuilder extends Builder {
    constructor(project) {
        super(project);
    }

    setupProject(cb) {
		const project = this.project;
		if (project.canceled)
			return cb('cancelled');

		const jsonFilePath = path.join(project.projectPath, "xul", "chrome", "content", "hello.xul");
		project.xulFilePath = "xul/chrome/content/hello.xul";

		fs.readFile(jsonFilePath, "utf-8", (err, content) => {
			if (err) {
			    this.logger.info('File Read error');
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

				this.logger.info('Xul change success');
				return cb();
			});
		});
    }

    build(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        const cmd = `zip -r Rodin.zip ${project.xulFilePath}`;
        this.logger.info(`Executing command ${cmd}`);
        child_process.exec(cmd, {cwd: project.projectPath}, (err, stdout, stderr) => {
            if (err || stdout.match(new RegExp('error'))) {
                this.logger.info("Build failed");
                this.logger.info({err, stdout, stderr});
                project.built = 'failed';
                return cb(new errors.BuildError(stdout, stderr));
            }

            this.logger.info("Build success");
            project.built = 'success';
            project.binaryPath = path.join(project.projectPath, configs.builder.buildDir, 'Rodin.zip');
            return cb();
        });
    }
}

module.exports = OculusBuilder;
