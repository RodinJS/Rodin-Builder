const configs = require('../config/config');
const IOSBuilder = require('./IOSBuilder');
const ViveBuilder = require('./ViveBuilder');
const OculusBuilder = require('./OculusBuilder');
const AndroidBuilder = require('./AndroidBuilder');

module.exports.createInstance = (project) => {
    switch (configs.platform) {
        case 'ios':
            return new IOSBuilder(project);

        case 'android':
            return new AndroidBuilder(project);

        case 'oculus':
            return new OculusBuilder(project);

        case 'vive':
            return new ViveBuilder(project);
    }
};