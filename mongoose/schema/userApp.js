const mongoose = require('mongoose');
const configs = require('../../config/config');
const UniqueID = require('../../utils/UniqueID');
const Schema = mongoose.Schema;

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

        buildStatus: {
            type: Boolean,
            default: false
        },

        downloadUrl: String,

        ios: {
            developerId: String,
            certPassword: String,
            uuid: String,
            uuName: String,
            uuDevelopmentTeam: String,
            bundleIdentifier: String,
            exportMethod: String
        },

        android: {
            package: String,
            iconPath: String,
            keyStore: {
                name: {
                    type: String,
                    default: UniqueID.v16
                },
                password: {
                    type: String,
                    required: true
                },
                firstLastName: String,
                organization: String,
                city: String,
                state: String,
                countryCode: String,
                alias: {
                    type: String,
                    default: UniqueID.v16
                },
                aliasPassword: {
                    type: String,
                    required: true
                }
            }
        },

        vive: {
            package: String,
            iconPath: String,
            keyStore: {}
        },

        oculus: {
            package: String,
            iconPath: String,
            keyStore: {}
        }
    }
);

userSchema.index({userId: 1});
userSchema.index({userId: 1, appId: 1});
userSchema.set("autoIndex", configs.db.autoIndex);
userSchema.plugin(require('../plugins/pagedFind'));

module.exports = userSchema;