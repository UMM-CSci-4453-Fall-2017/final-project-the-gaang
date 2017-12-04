var express = require('express');
var mongo = require('mongodb');
Promise = require('bluebird');
var using = Promise.using;
var router = express.Router();
//var person = './public/person.html'
var path = path

app = express();
port = process.env.PORT || 1337;

app.use(express.static(__dirname + '/public'));
//app.use('/person', person);

app.get("/person", function(req, res){
    res.sendFile(__dirname + '/public/person.html');
    }
);

app.listen(port);

//TODO write all of the routes