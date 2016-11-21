const errors = require('./buildErrors');
const path = require('path');
const fs = require('fs-extra');
const iconProcess = require('./iconProcess');
const configs = require('../config/config');

class Builder {
    constructor(project) {
        this.project = project;
    }

    init(cb) {
        console.log('this in init', this);
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        const tempProjectPath = path.join(configs.builder.userDir, configs.builder.projectsDir, configs.builder.tempProjectName);
        const projectPath = path.join(configs.builder.userDir, configs.builder.projectsDir, project.userId, project.appId);

        project.tempProjectPath = tempProjectPath;
        project.projectPath = projectPath;

        fs.stat(projectPath, (err, status) => {
            if (status) {
                console.log(`folder exists: ${projectPath}`);
                console.log(`removing folder: ${projectPath}`);
                fs.remove(projectPath);
                console.log(`folder removed: ${projectPath}`);
                return cb();
            }

            fs.mkdirp(projectPath, err => {
                console.log(`folder created: ${projectPath}`);
                if (err) {
                    return cb(new errors.MKDIRError(projectPath, 'init'));
                }

                return cb();
            });
        });
    };

    copyTemplate(cb) {
        const project = this.project;
        if (project.canceled)
            return cb('cancelled');

        fs.copy(project.tempProjectPath, project.projectPath, (err) => {
            if (err) {
                return cb(new errors.CopyError(project.tempProjectPath, project.projectPath, 'copy'));
            }

            console.log(`copy to folder: ${project.projectPath}`);
            return cb();
        });
    };

    clean(cb) {
        return cb();
    }

    setupBuild(cb) {
        return cb();
    }

    setupProject(cb) {
        return cb();
    }

    build(cb) {
        return cb();
    }

    rename(cb) {
        const oldPath = this.project.binaryPath;
        const newPath = path.join(path.dirname(oldPath), this.project.appName + path.extname(oldPath));
        fs.rename(oldPath, newPath, err => {
            if(err) {
                return cb(err);
            }

            this.project.binaryPath = newPath;
            return cb();
        });
    }

    iconProcess(cb) {
        return iconProcess(this.project)(cb);
    }
}

module.exports = Builder;