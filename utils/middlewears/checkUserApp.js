const Emitter = require('../../utils/emitter');
const CustomErrors = require('../../utils/errors');

const MongoConnection = require('../../mongoose/connection');
const App = MongoConnection.model('App');
const UserApp = MongoConnection.model('UserApp');

module.exports = {
    build: build,
    cancel: cancel
};

function cancel (req, res, next) {
    const emitter = new Emitter(req, res);
    console.log('mtav');

    if (!req.body.project) {
        return emitter.sendError(new CustomErrors.InvalidRequestData());
    }

    const project = JSON.parse(req.body.project);

    if (!project.appId || !project.userId) {
        return emitter.sendError(new CustomErrors.InvalidRequestData());
    }

    UserApp.findOne(
        {
            userId: project.userId,
            appId: project.appId
        },
        (err, userApp) => {
            if (err) {
                return emitter.sendError(new CustomErrors.InvalidRequestData());
            }

            req.userApp = userApp;
            return next();
        }
    )
}

function build(req, res, next) {
    const emitter = new Emitter(req, res);
    console.log('mtav');

    if (!req.body.project) {
        return emitter.sendError(new CustomErrors.InvalidRequestData());
    }

    const project = JSON.parse(req.body.project);

    if (!project.appId || !project.userId) {
        return emitter.sendError(new CustomErrors.InvalidRequestData());
    }

    UserApp.findOne(
        {
            userId: project.userId,
            appId: project.appId
        },
        (err, userApp) => {
            if (err) {
                return emitter.sendError(new CustomErrors.InvalidRequestData());
            }

            if (!userApp)
                userApp = new UserApp(project);
            else
                for (let i in project)
                    if (project.hasOwnProperty(i))
                        userApp[i] = project[i];

            userApp.save((err, userApp) => {
                if (err) {
                    console.log(err);
                    return emitter.sendError(new CustomErrors.InvalidRequestData());
                }

                req.userApp = userApp;
                return next();
            })
        }
    )
}