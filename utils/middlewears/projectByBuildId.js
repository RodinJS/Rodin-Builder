const Emitter = require('../../utils/emitter');
const CustomErrors = require('../../utils/errors');

const MongoConnection = require('../../mongoose/connection');
const UserApp = MongoConnection.model('UserApp');

module.exports = (req, res, next) => {
    const emitter = new Emitter(req, res);

    console.log(req.params.buildId);
    UserApp.findOne(
        {
            buildId: req.params.buildId
        },
        (err, project) => {
            if(err || !project) {
                return emitter.sendError(new CustomErrors.InvalidBuildId());
            }

            req.project = project;
            return next();
        }
    )
};
