const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const methodOverride = require('method-override');
const morgan = require("morgan");
const path = require("path");
const async = require('async');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

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

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'apidoc', 'index.html'));
});

const port = argv.p || argv.port || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});