module.exports.setup = function (_platform) {
    module.exports.platform = _platform;
    module.exports.server = require('./server');
    module.exports.envirement = require('./envirement');
    module.exports.log = require('./log');
    module.exports.db = require('./db')(_platform);
    module.exports.builder = require(`./buildConfigs/${_platform}`);
};
