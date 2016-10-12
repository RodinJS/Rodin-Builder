const App = require('../../mongoose/connection').model('App');
const CustomErrors = require('../errors');
const Emitter = require('../emitter');

module.exports = (req, res, next) => {
    const appId = req.headers['app-id'];
    const appSecret = req.headers['app-secret'];
    const emitter = new Emitter(req, res);

    if(!appId || !appSecret) {
        return emitter.sendError(new CustomErrors.InvalidRequestData());
    }

    App.findOne({appId: appId, appSecret: appSecret}, (err, app) => {
        if(err) {
            return emitter.sendError(err);
        }

        if(!app) {
            return emitter.sendError(new CustomErrors.InvalisAppIdOrSecret());
        }

        req.app = app;
        next();
    });
};