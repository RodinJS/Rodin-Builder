const Emitter = require('../../utils/emitter');
const CustomErrors = require('../../utils/errors');

const MongoConnection = require('../../mongoose/connection');
const App = MongoConnection.model('App');
const UserApp = MongoConnection.model('UserApp');

module.exports = (req, res, next) => {
    const emitter = new Emitter(req, res);

    if(!req.body.project) {
        return emitter.sendError(new CustomErrors.InvalidRequestData());
    }

    const project = JSON.parse(req.body.project);

    if (!project.appId || !project.userId ) {
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

            userApp = new UserApp(project);
            userApp.save((err, userApp) => {
                console.log(err);
                if (err) {
                    return emitter.sendError(new CustomErrors.InvalidRequestData());
                }
                req.userApp = userApp;
                return next();
            })
        }
    )
};