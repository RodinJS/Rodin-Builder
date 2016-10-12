const Connection = require('../mongoose/connection');
const argv = require('minimist')(process.argv.slice(2));
const Table = require('cli-table');

Connection.once('open', () => {
    require('../mongoose/models')(Connection);
    generate();
});

function generate() {
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