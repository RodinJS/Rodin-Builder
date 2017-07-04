module.exports.development = global.env === 'dev';
module.exports.stage = global.env === 'stage';
module.exports.testing = global.env === 'testing';
module.exports.production = global.env === 'prod';

module.exports.mode = () => global.env;
