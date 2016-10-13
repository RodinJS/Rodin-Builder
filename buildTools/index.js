const configs = require('../config/config');
const ViveBuilder = require('./ViveBuilder');

module.exports.createInstance = (project) => {
    switch (configs.platform) {
        case 'vive':
            return new ViveBuilder(project);
    }
};