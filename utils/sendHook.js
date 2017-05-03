const request = require('request');
const configs = require('../config/config');

module.exports = (app, cb) => {
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
                return cb();
            }

            return cb({err, statusCode: response.statusCode, body})
        }
    );
};