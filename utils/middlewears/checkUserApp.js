const Emitter = require('../../utils/emitter');
const CustomErrors = require('../../utils/errors');

const MongoConnection = require('../../mongoose/connection');
const App = MongoConnection.model('App');
const UserApp = MongoConnection.model('UserApp');

module.exports = {
    build: build,
    cancel: cancel
};

function cancel(req, res, next) {
    const emitter = new Emitter(req, res);
    console.log('mtav');

    if (!req.body.project) {
        return emitter.sendError(new CustomErrors.InvalidRequestData());
    }

    const project = JSON.parse(req.body.project);

    if (!project.appId || !project.userId) {
        return emitter.sendError(new CustomErrors.InvalidRequestData());
    }

    UserApp.find({
        userId: project.userId,
        appId: project.appId
    }).sort({_id: -1}).limit(1).exec((err, userApps) => {
        if (err || userApps.length === 0) {
            return emitter.sendError(new CustomErrors.InvalidRequestData());
        }

        req.userApp = userApps[0];
        return next();
    })
}

function build(req, res, next) {
    const emitter = new Emitter(req, res);

    if (!req.body.project) {
        return emitter.sendError(new CustomErrors.InvalidRequestData());
    }

    const project = JSON.parse(req.body.project);
    // const project = req.body.project;

    if (!project.appId || !project.userId) {
        return emitter.sendError(new CustomErrors.InvalidRequestData());
    }

    const userApp = new UserApp(project);
    userApp.save((err, userApp) => {
        if (err) {
            return emitter.sendError(new CustomErrors.InvalidRequestData());
        }

        req.userApp = userApp;
        return next();
    });
}