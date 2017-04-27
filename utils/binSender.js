const cron = require('node-cron');
const async = require('async');
const request = require('request');
const fs = require('fs-extra');
const configs = require('../config/config');
const Logger = require('../logger/Logger');

const logger = new Logger(`${configs.platform}-${configs.envirement.mode()}.log`, configs.envirement.development);

const MongoConnection = require('../mongoose/connection');
const UserApp = MongoConnection.model('UserApp');

console.log(configs.envirement.mode());
const send = (app, cb) => {
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
                logger.info(`project with ${app.appId} sent`);
            }

            app.sent = true;
            return app.save(err => {
                return cb();
            });
        }
    );
};

const sendResponse = () => {
    UserApp.find(
        {
            $or: [
                {
                    built: true,
                    sent: false
                },
                {
                    built: false,
                    error: { $exists: true },
                    sent: false
                }
            ]
        },
        (err, apps) => {
            if (err) {
                return -1;
            }

            if (apps.length === 0) {
                return 0;
            }

            logger.info(`sending ${apps.length} files`);
            let sentCount = 0;
            async.eachLimit(apps, 10,
                (app, cb) => {
                    return send(app, err => {
                        if (!err) {
                            sentCount++;
                        }
                        return cb();
                    })
                },
                err => {
                    logger.info(`files sent: ${sentCount}`);
                }
            );
        }
    )
};

module.exports.run = () => {
    cron.schedule(configs.builder.cron.binSender, sendResponse, true);
};