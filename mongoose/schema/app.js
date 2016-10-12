const mongoose = require('mongoose');
const configs = require('../../config/config');
const UniqueID = require('../../utils/UniqueID');
const Schema = mongoose.Schema;

const appSchema = new Schema(
    {
        appId: {
            type: String,
            default: UniqueID.v16
        },
        appSecret: {
            type: String,
            default: UniqueID.generate
        },
        name: {
            type: String,
            unique: true,
            required: true
        },
        allowedIps: {
            type: [String],
            default: []
        },
        responseURL: {
            type: String
        }
    }
);


appSchema.methods.outcome = function (){
    return {
        name: this.name,
        responseURL: this.responseURL
    }
};

appSchema.index({appId: 1});
appSchema.set("autoIndex", configs.db.autoIndex);
appSchema.plugin(require('../plugins/pagedFind'));

module.exports = appSchema;