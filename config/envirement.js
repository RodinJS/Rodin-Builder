module.exports.development = true;
module.exports.mode = () => module.exports.development === true ? 'dev' : 'prod';
