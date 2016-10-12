"use strict";

const Logger = require("./Logger");
let logger = new Logger("api/requests.log", false);

module.exports = function (req, res, next) {

    let logData = {
        url: req.url,
        ip: req.connection.remoteAddress,
        body: req.body,
        method: req.method,
        date: new Date()
    };

    if(req.headers["x-access-token"]) {
        logData["x-access-token"] = req.headers["x-access-token"];
    }

    if(req.headers["admin-access-token"]) {
        logData["admin-access-token"] = req.headers["admin-access-token"];
    }

    if(req.headers["fake-access-token"]) {
        logData["fake-access-token"] = req.headers["fake-access-token"];
    }

    logger.info(`Request`, logData);
    return next();
};