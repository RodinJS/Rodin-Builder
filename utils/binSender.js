const cron = require('node-cron');
const async = require('async');
const request = require('request');
const fs = require('fs-extra');
const configs = require('../config/config');
const Logger = require('../logger/Logger');

const logger = new Logger(`${configs.platform}-${configs.envirement.mode()}.log`, configs.envirement.development);

const MongoConnection = require('../mongoose/connection');
const UserApp = MongoConnection.model('UserApp');

const send = (app, cb) => {
    request(
        {
            method: 'POST',
            preambleCRLF: true,
            postambleCRLF: true,
            uri: `${configs.binSender.url}/${app.appId}/${configs.platform}`,
            json: {
                buildId: app.buildId,
                built: app.built
            },
            headers: {
                'x-access-token': configs.binSender.token
            }
        },
        (err, response, body) => {
            if (err || response.statusCode !== 200) {
                return cb(err);
            }

            app.sent = true;
            logger.info(`project with ${app.appId} sent`);
            return app.save(err => {
                return cb();
            });
        }
    );
};

const sendResponse = () => {
    UserApp.find(
        {
            built: true,
            sent: false
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