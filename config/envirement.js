module.exports.development = process.env.NODE_ENV === 'dev';
module.exports.mode = () => module.exports.development === true ? 'dev' : 'prod';
