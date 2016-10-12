module.exports = function (db) {
    db.model('App', require("./schema/app.js"));
    db.model('UserApp', require("./schema/userApp.js"));
};