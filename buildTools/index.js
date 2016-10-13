const configs = require('../config/config');
const ViveBuilder = require('./ViveBuilder');
const OculusBuilder = require('./OculusBuilder');

module.exports.createInstance = (project) => {
    switch (configs.platform) {
        case 'oculus':
            return new OculusBuilder(project);

        case 'vive':
            return new ViveBuilder(project);
    }
};