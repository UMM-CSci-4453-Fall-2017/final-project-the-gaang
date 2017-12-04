var express = require('express');
var mongo = require('mongodb');
Promise = require('bluebird');
var using = Promise.using;
const bodyParser = require('body-parser');

app = express();
port = process.env.PORT || 1337;

app.use(express.static(__dirname + '/public'));

app.listen(port);
async function run(){
    const db = mongodb.mongoClient.connect('mongodb:<ip:port/databaseName>'); // replace with real stuff, don't commit ip. Look at lab 10 for ip and port
    const app = express();
    app.use(bodyParser.json());


var getById = function(collection, orgID){
    return JSON.stringify(db.getCollection(collection).find(_id = orgID));
}


app.get("/organization/:orgID", function(req,res){
    var orgID = req.param("orgID");
    res.send(getById("AtLAOrganizations", orgID));
}

app.get("/people/:personID", function(req, res){
    var id = req.param("personID");
    res.send(getById("AtLAPeople", id));
}

//TODO write all of the routes/
}