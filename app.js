const minimist = require('minimist');

let platform = "";
const argv = minimist(process.argv.slice(2));
global.env = argv['env'];

const configs = require('./config/config');
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const methodOverride = require('method-override');
const morgan = require("morgan");
const path = require("path");
const async = require('async');

switch (true) {
    case argv['ios']:
        platform = "ios";
        break;

    case argv['android']:
        platform = "android";
        break;

    case argv['oculus']:
        platform = "oculus";
        break;

    case argv['vive']:
        platform = "vive";
        break;

    default:
        throw new Error('Unsupported platform');
        break;
}

configs.setup(platform);
const app = express();

/**
 * setup middlewears
 */
app.use(cors());
app.use(helmet());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname + '/public')));

if (configs.envirement.development || configs.envirement.testing) {
    app.use(morgan("dev"));
}

const connectDB = cb => {
    const connection = require('./mongoose/connection');
    connection['once']('open', () => {
        require('./mongoose/models')(connection);
        cb();
    });
};

async.parallel(
    [
        connectDB
    ],
    err => {
        if (err) {
            console.log(err);
            process.exit(0);
        }

        require("./routes/setupRoutes")(app);
        const port = argv['p'] || configs.server.port;
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server running on port ${port}. Env: ${argv['env']}`);
        });
    }
);