const Connection = require('../mongoose/connection');
const argv = require('minimist')(process.argv.slice(2));
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