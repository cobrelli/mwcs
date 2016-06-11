var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('lodash');

var port = 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

console.log('server running at: http://localhost:' + port);
server.listen(port);