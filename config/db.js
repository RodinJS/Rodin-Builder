module.exports = _platform => {
    return {
        url: `mongodb://127.0.0.1:27017/${GLOBAL.platform}-app-builder`,
        autoIndex: true
    }
};