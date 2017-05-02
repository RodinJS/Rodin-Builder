const async = require('async');
const path = require('path');
const buildTools = require(`../buildTools`);

const MongoConnection = require('../mongoose/connection');
const UserApp = MongoConnection.model('UserApp');


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
        this.current = project;

        const builder = buildTools.createInstance(this.current);

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
                builder.sendHook.bind(builder)
            ],
            err => {
                this.busy = false;

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
                        if(!err) {
                            delete this.current;
                        }

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
            this.build(project);
        } else {
            this.queue.push(project);
        }

        return cb(null, {prev: this.queue.length});
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