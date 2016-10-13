const path = require("path");
const multer = require('multer');

const requestLogger = require('../logger/requestLoggerMiddlewear');
const checkAppSecret = require('../utils/middlewears/checkAppSecret');
const checkUserApp = require('../utils/middlewears/checkUserApp');
const projectByBuildId = require('../utils/middlewears/projectByBuildId');
const projectByDownloadUrl = require('../utils/middlewears/projectByDownloadUrl');
const UniqueID = require('../utils/UniqueID');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },

    filename: function (req, file, cb) {
        let nameArray = file.originalname.split('.');
        nameArray.splice(-1, 0, Date.now());
        nameArray.splice(-1, 0, UniqueID.v16());
        let newName = nameArray.join('.');
        cb(null, newName);
    }
});

const upload = multer({storage: storage});

module.exports = app => {
    app.use('/', upload.fields(
        [
            {
                name: 'icon-m',
                maxCount: 1
            },
            {
                name: 'icon-h',
                maxCount: 1
            },
            {
                name: 'icon-xh',
                maxCount: 1
            },
            {
                name: 'icon-xxh',
                maxCount: 1
            },
            {
                name: 'icon-xxxh',
                maxCount: 1
            },
            {
                name: 'cert',
                maxCount: 1
            },
            {
                name: 'profile',
                maxCount: 1
            }
        ]
    ));

    app.use('/', requestLogger);
    app.use('/api/v1/bin/:downloadUrl', projectByDownloadUrl, require('./api.v1/binRouter'));
    app.use('/api', checkAppSecret);
    app.use('/api/v1/app', require('./api.v1/appRouter'));
    app.use('/api/v1/status/:buildId', projectByBuildId, require('./api.v1/projectStatusRouter'));
    app.use('/api/v1/project/:buildId', projectByBuildId, require('./api.v1/projectRouter'));
    app.use('/api/v1/project', checkUserApp, require('./api.v1/buildRouter'));

    app.get('/', (req, res) => {
        res.end('Welcome to android-app-configs')
    })
};
