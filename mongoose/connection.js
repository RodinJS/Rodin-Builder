const mongoose = require('mongoose');
const configs = require('../config/config');

const db = mongoose.createConnection(configs.db.url);

db.on('connected', () => {
    console.log(`mongoose "eyme" db connected`);
});

db.once('open', () => {
    //logger.info("mongoose ready");
});

db.on('error', (err) => {
    console.log(`mongoose connection error: ${err}`);
    process.exit(0);
});

db.on('disconnected', () => {
    console.log("mongoose disconnected");
});

module.exports = db;