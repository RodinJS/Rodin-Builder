const async = require('async');
const fs = require('fs-extra');
const configs = require('../config/config');
const path = require('path');
const request = require('request');
const child_process = require('child_process');
const iconProcess = require('./iconProcess');

const MongoConnection = require('../mongoose/connection');
const UserApp = MongoConnection.model('UserApp');

const check = project => cb => {
    if (project.canceled)
        return cb('cancelled');

    const tempProjectPath = path.join(configs.builder.userDir, configs.builder.projectsDir, configs.builder.tempProjectName);
    const projectPath = path.join(configs.builder.userDir, configs.builder.projectsDir, project.userId, project.appId);

    project.tempProjectPath = tempProjectPath;
    project.projectPath = projectPath;

    fs.stat(projectPath, (err, status) => {
        if (status) {
            console.log(`folder exists: ${projectPath}`);
            return cb();
        }

        fs.mkdirp(projectPath, err => {
            console.log(`folder created: ${projectPath}`);
            if (err) {
                return cb(err);
            }

            return cb();
        });
    })
};

const copy = project => cb => {
    if (project.canceled)
        return cb('cancelled');

    fs.copy(project.tempProjectPath, project.projectPath, (err) => {
        console.log(`copy to folder: ${project.projectPath}`);
        return cb(err);
    })
};

const clean = project => cb => {
    return cb();
    // if (project.canceled)
    //     return cb('cancelled');
    //
    // child_process.exec('./gradlew clean', {cwd: project.projectPath}, (err, stdout, stderr) => {
    //     console.log('clean finished');
    //     return cb();
    // });
};

const generate = project => cb => {
    return cb();

    // if (project.canceled)
    //     return cb('cancelled');
    //
    // const keyStore = project.android.keyStore;
    // const command = `keytool -genkey -noprompt -alias ${keyStore.alias} -keypass ${keyStore.aliasPassword} -keystore ${keyStore.name}.keystore -storepass ${keyStore.password} -dname "CN=mqttserver.ibm.com, OU=ID, O=IBM, L=Hursley, S=Hants, C=GB"`;
    // child_process.exec(command, {cwd: project.projectPath}, (err, stdout, stderr) => {
    //     console.log('keyStore generate success');
    //     project.keyStorePath = path.join(project.projectPath, `${keyStore.name}.keystore`);
    //     return cb();
    // });
};

const edit = project => cb => {
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
            return cb(err);
        }

        console.log('Json change success');
        return cb();
    });
};

const process = project => cb => {
    if (project.canceled)
        return cb('cancelled');

    child_process.exec(`zip -r Rodin.zip ${project.jsonFilePath}`, {cwd: project.projectPath}, (err, stdout, stderr) => {
        console.log('stdout: ' + stdout);
        console.log('err: ' + err);
        console.log('stderr: ' + stderr);

        if (err || stdout.match(new RegExp('error'))) {
            project.built = 'failed';
        } else {
            project.built = 'success';
        }

        console.log(`build status: ${project.built}`);
        project.binaryPath = path.join(project.projectPath, configs.builder.buildDir, 'Rodin.zip');
        return cb();
    });
};

class BuilderQueue {
    constructor() {
        this.queue = [];
        this.busy = false;
    }

    length() {
        return this.queue.length
    }

    isEmpty() {
        return this.length() === 0;
    }

    deQueue() {
        return this.queue.shift();
    }

    build(project) {
        this.busy = true;
        console.log('build start');

        async.series(
            [
                check(project),
                copy(project),
                iconProcess(project),
                clean(project),
                generate(project),
                edit(project),
                process(project)
            ],
            err => {

                if (err) {
                    if (!this.isEmpty()) {
                        this.build(this.deQueue());
                    }
                    console.log(err);
                    return;
                }

                UserApp.findByIdAndUpdate(project._id,
                    {
                        $set: {
                            built: true,
                            buildId: project.buildId,
                            bin: {
                                path: path.join(project.binaryPath)
                            }
                        }
                    },
                    err => {
                        this.busy = false;
                        console.log('built');

                        if (!this.isEmpty()) {
                            this.build(this.deQueue());
                        }
                    }
                );
            }
        );
    }

    requestBuild(project, cb) {
        if (this.isEmpty() && !this.busy) {
            console.log(project);
            this.build(project);
        } else {
            this.queue.push(project);
        }

        return cb(null, {prev: this.queue.length});
    }

    removeByBuildID(buildId) {
        if (this.current && this.current.buildId === buildId) {
            this.current.canceled = true;
            return true;
        }

        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].buildId === buildId) {
                this.queue.splice(i, 1);
                return true;
            }
        }

        return false;
    }
}

const instance = new BuilderQueue();
module.exports = instance;