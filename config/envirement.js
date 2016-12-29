module.exports.development = global.env === 'dev';
module.exports.mode = () => module.exports.development === true ? 'dev' : 'prod';
