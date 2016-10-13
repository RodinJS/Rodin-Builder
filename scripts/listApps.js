const argv = require('minimist')(process.argv.slice(2));
const configs = require('../config/config');

let platform = "";

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

const Connection = require('../mongoose/connection');
const Table = require('cli-table');

Connection.once('open', () => {
    require('../mongoose/models')(Connection);
    list();
});

function list() {
    const App = Connection.model('App');

    var request = {};
    App.find(request, (err, apps) => {
        if(err) {
            console.error(err);
            process.exit(0);
        }

        let table = new Table({
            head: ['Name', 'appId', 'appSecret'],
            colWidths: [20, 25, 50]
        });

        for(let app of apps) {
            table.push([app.name || "untitled", app.appId, app.appSecret]);
        }

        console.log(table.toString());
        process.exit(0);
    })
}