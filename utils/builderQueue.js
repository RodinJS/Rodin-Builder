const async = require('async');
const path = require('path');
const buildTools = require(`../buildTools`);
const config = require('../config/config');

const MongoConnection = require('../mongoose/connection');
const UserApp = MongoConnection.model('UserApp');


class BuilderQueue {
    constructor(maxProcesses = config.builder.maxProcesses) {
        this.queue = [];
        this.busy = false;
        this.maxProcesses = maxProcesses;
        this.runningProcesses = 0;
        this.currents = {};
    }

    get length() {
        return this.queue.length
    }

    deQueue() {
        return this.queue.shift();
    }

    build(project) {
        this.runningProcesses++;
        this.currents[project.appId] = project;

        const builder = buildTools.createInstance(project);

        async.series(
            [
                builder.init.bind(builder),
                builder.copyTemplate.bind(builder),
                builder.clean.bind(builder),
                builder.setupBuild.bind(builder),
                builder.setupProject.bind(builder),
                builder.iconProcess.bind(builder),
                builder.build.bind(builder),
                builder.rename.bind(builder),
            ],
            err => {
                builder.sendHook(err);

                const updateQuery = {
                    $set: {}
                };

                if (err) {
                    builder.logger.info(`Saving project with error ${project.buildId}`);
                    updateQuery.$set = {
                        built: false,
                        sent: false,
                        buildId: project.buildId,
                        error: err
                    }
                } else {
                    builder.logger.info(`Saving built project ${project.buildId}`);
                    updateQuery.$set = {
                        built: true,
                        sent: false,
                        buildId: project.buildId,
                        bin: {
                            path: path.join(project.binaryPath)
                        }
                    }
                }

                UserApp.findByIdAndUpdate(project._id,
                    updateQuery,
                    err => {
                        if (err)
                            builder.logger.info(`Project save error ${err}`);
                        else
                            builder.logger.info(`Project save success`);

                        this.runningProcesses--;
                        delete this.currents[project.appId];

                        if (this.runningProcesses < this.maxProcesses) {
                            this.build(this.deQueue());
                        }
                    }
                );
            }
        );
    }

    requestBuild(project, cb) {
        if (this.runningProcesses < this.maxProcesses)
            this.build(project);
        else
            this.queue.push(project);

        return cb(null, {prev: this.length});
    }

    removeByBuildID(appId) {
        if (this.current && this.current.appId === appId) {
            this.current.canceled = true;
            return true;
        }

        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].appId === appId) {
                this.queue.splice(i, 1);
                return true;
            }
        }

        return false;
    }
}

const instance = new BuilderQueue();
module.exports = instance;