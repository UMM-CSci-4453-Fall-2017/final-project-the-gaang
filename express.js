var express = require('express');
var mongo = require('mongodb');
Promise = require('bluebird');
var using = Promise.using;

app = express();
port = process.env.PORT || 1337;

app.use(express.static(__dirname + '/public'));

app.listen(port);

//TODO write all of the routes