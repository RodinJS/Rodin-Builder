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

        const jsonFilePath = path.join(project.projectPath, "RodinData", "config.json");
        project.jsonFilePath = "RodinData/config.json";
        const content = JSON.stringify({
            "appName": project.appName,
            "appUrl": project.url
        });

        fs.writeFile(jsonFilePath, content, 'utf-8', (err) => {
            if (err) {
                return cb(new errors.FileWriteError(jsonFilePath, 'setupProject'));
            }

            console.log('Json change success');
            return cb();
        });
    }

    build(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        child_process.exec(`zip -r Rodin.zip ${project.jsonFilePath}`, {cwd: project.projectPath}, (err, stdout, stderr) => {
            if (err || stdout.match(new RegExp('error'))) {
                project.built = 'failed';
                console.log(`build status: ${project.built}`);
                return cb(new errors.BuildError(stdout, stderr));
            }

            console.log(`build status: ${project.built}`);
            project.built = 'success';
            project.binaryPath = path.join(project.projectPath, configs.builder.buildDir, 'Rodin.zip');
            return cb();
        });
    }
}

module.exports = OculusBuilder;
