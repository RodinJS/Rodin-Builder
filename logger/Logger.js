const winston = require('winston');
const fs = require('fs-extra');
const path = require('path');
const configs = require('../config/config');

module.exports = class Logger extends winston.Logger {

    /**
     * @param {string} _path
     * @param {boolean} _console
     */
    constructor(_path, _console) {
        const logPath = path.join(__dirname, '../logs/', _path);

        try {
            fs.statSync(logPath);
        } catch (ex) {
            fs.createFileSync(logPath);
        }

        let transports = [
            new winston.transports.File({filename: logPath})
        ];

        if (_console !== false && configs.envirement.development) {
            transports.push(new winston.transports.Console());
        }

        super({
            transports: transports,
            maxsize: configs.log.maxsize
        });

        this.info(`Logs started at ${Date.now()}`);
    };
};