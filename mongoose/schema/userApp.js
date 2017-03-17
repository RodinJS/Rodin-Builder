const mongoose = require('mongoose');
const configs = require('../../config/config');
const UniqueID = require('../../utils/UniqueID');
const crypt = require('../../utils/crypt');
const Schema = mongoose.Schema;

const userAppSchema = new Schema(
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

        built: {
            type: Boolean,
            default: false
        },

        sent: {
            type: Boolean,
            default: false
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
                password: String,
                firstLastName: String,
                organization: String,
                city: String,
                state: String,
                countryCode: String,
                alias: {
                    type: String,
                    default: UniqueID.v16
                },
                aliasPassword: String
            }
        },

        vive: {
            package: String,
            iconPath: String,
            keyStore: {},
            viveportId: String,
            viveportKey: String,
            store: {
                type: Boolean,
                default: false
            },
            jsonData: String
        },

        oculus: {
            package: String,
            iconPath: String,
            keyStore: {}
        }
    }
);

userAppSchema.pre('save', function (next) {
    if(this.vive && this.vive.viveportId) {
        this.vive.store = true;
        this.vive.jsonData = crypt(JSON.stringify({id: this.vive.viveportId, key: this.vive.viveportKey}), configs.rodin_key);
        this.vive.viveportId = undefined;
        this.vive.viveportKey = undefined;
    }

    next();
});

userAppSchema.index({userId: 1});
userAppSchema.index({userId: 1, appId: 1});
userAppSchema.set("autoIndex", configs.db.autoIndex);
userAppSchema.plugin(require('../plugins/pagedFind'));

module.exports = userAppSchema;