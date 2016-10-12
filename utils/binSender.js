const cron = require('node-cron');
const async = require('async');
const request = require('request');
const fs = require('fs-extra');
const configs = require('../config/config');

const MongoConnection = require('../mongoose/connection');
const UserApp = MongoConnection.model('UserApp');

const send = (app, cb) => {
    request(
        {
            method: 'POST',
            preambleCRLF: true,
            postambleCRLF: true,
            uri: app.responseURL,
            multipart: [
                {
                    'content-type': configs.builder.binContentType,
                    body: fs.createReadStream(app.bin.path)
                }
            ],
            json: {
                userId: app.userId,
                appId: app.appId
            }
        },
        (err, response, body) => {
            if (err) {
                return cb(err);
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

            console.log(`sending ${apps.length} files`);
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
                    console.log(`files sent: ${sentCount}`);
                }
            );
        }
    )
};

module.exports.run = () => {
    cron.schedule(configs.builder.cron.binSender, sendResponse, true);
};