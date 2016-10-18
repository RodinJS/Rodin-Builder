module.exports = _platform => {
    return {
        url: `mongodb://127.0.0.1:27017/${_platform}-app-builder`,
        autoIndex: true
    }
};