const argv = require('minimist')(process.argv.slice(2));
const configs = require('../config/config');
global.env = argv['env'];

let platform = "";

switch (true) {
    case argv['ios']:
        platform = "ios";
        break;

    case argv['android']:
        platform = "android";
        break;

    case argv['daydream']:
        platform = "daydream";
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

const Connection = require('../mongoose/connection');
Connection.once('open', () => {
    require('../mongoose/models')(Connection);
    generate();
});

function generate() {
    const App = Connection.model('App');

    const app = new App(
        {
            name: argv.name
        }
    );

    app.save((err) => {
        if(err) {
            console.error(err);
            process.exit(0);
        }

        console.log('App created successfully');
        console.log(`appId\t\t: ${app.appId}`);
        console.log(`appSecret\t: ${app.appSecret}`);

        process.exit(0);
    });
}