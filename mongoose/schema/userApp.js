const mongoose = require('mongoose');
const configs = require('../../config/config');
const UniqueID = require('../../utils/UniqueID');
const Schema = mongoose.Schema;
const UniqueId = require('../../utils/UniqueID');

const userSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        appId: {
            type: String,
            required: true
        },
        uuid: String,
        uuName: String,

        appName: {
            type: String,
            required: true
        },
        version: {
            type: String,
            default: "1.0"
        },
        url: {
            type: String,
            required: true
        },

        bin: {
            path: String
        },

        buildId: String,
        downloadUrl: String,

        vive: {
            package: String,
            iconPath: String,
            keyStore: {

            }
        }
    }
);

userSchema.index({userId: 1});
userSchema.index({userId: 1, appId: 1});
userSchema.set("autoIndex", configs.db.autoIndex);
userSchema.plugin(require('../plugins/pagedFind'));

module.exports = userSchema;