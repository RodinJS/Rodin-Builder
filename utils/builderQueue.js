const async = require('async');
const fs = require('fs-extra');
const configs = require('../config/config');
const path = require('path');
const request = require('request');
const child_process = require('child_process');

const MongoConnection = require('../mongoose/connection');
const UserApp = MongoConnection.model('UserApp');

const buildTools = require(`../buildTools`);

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
        console.log('build start');

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
                builder.rename.bind(builder)
            ],
            err => {
                this.busy = false;

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
                            sent: false,
                            buildId: project.buildId,
                            bin: {
                                path: path.join(project.binaryPath)
                            }
                        }
                    },
                    err => {
                        console.log('built');
                        delete this.current;

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

    removeByBuildID(buildId) {
        if (this.current && this.current.buildId === buildId) {
            this.current.canceled = true;
            return true;
        }

        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].buildId === buildId) {
                console.log('found');
                this.queue.splice(i, 1);
                return true;
            }
        }

        console.log('not found');
        return false;
    }
}

const instance = new BuilderQueue();
module.exports = instance;