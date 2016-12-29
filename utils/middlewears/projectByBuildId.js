const Emitter = require('../../utils/emitter');
const CustomErrors = require('../../utils/errors');

const MongoConnection = require('../../mongoose/connection');
const UserApp = MongoConnection.model('UserApp');

module.exports = (req, res, next) => {
    const emitter = new Emitter(req, res);

    UserApp.findOne(
        {
            buildId: req.params.buildId
        },
        (err, project) => {
            console.log('asd', project);
            console.log('asd', err);
            if(err || !project) {
                return emitter.sendError(new CustomErrors.InvalidBuildId());
            }

            req.project = project;
            return next();
        }
    )
};
