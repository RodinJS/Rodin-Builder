module.exports = (_platform, env) => {
    return {
        url: `mongodb://mongo-${env}:27017/${_platform}-app-builder`,
        autoIndex: true
    }
};