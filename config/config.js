module.exports.setup = function (_platform) {
    module.exports.platform = _platform;
    module.exports.server = require('./server');
    module.exports.envirement = require('./envirement');
    module.exports.log = require('./log');
    module.exports.db = require('./db')(_platform);
    module.exports.builder = require(`./buildConfigs/${_platform}`);
};

module.exports.binSender = {
    url: 'http://rodin.space/api/hooks/build',
    token: 'K7rd6FzEZwzcc6dQr3cv9kz4tTTZzAc9hdXYJpukvEnxmbdB42V4b6HePs5ZDTYLW_4000dram'
};
