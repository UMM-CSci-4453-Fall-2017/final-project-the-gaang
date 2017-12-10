var express = require('express');
mysql=require('mysql');
var creds=require('./credentials.json');
//var mongo = require('mongodb');
Promise = require('bluebird');
var using = Promise.using;
//const bodyParser = require('body-parser');

app = express();
port = process.env.PORT || 1337;


creds.host='ids.morris.umn.edu';

Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection(creds);
var db = "atla";
var pool = mysql.createPool(creds);

var getConnection = function(){
    return pool.getConnectionAsync().disposer(
        function(connection){return connection.release();}
    );
};

var query = function(sql){
    return using(getConnection(), function(connection){
        return connection.queryAsync(sql);
    });
};

var endPool = function(){
    pool.end(function(err){});
};

var getDatabase = function(){
    var toReturn = query("USE " + db + ";");
    console.log(toReturn);
    return toReturn;
};

app.use(express.static(__dirname+ '/public'));
app.use(express.urlencoded()); // not entirely sure about this part here

app.get("/entity/:id", function(req, res){
    var id = req.params.id;
    var sql = 'Select * from ' + db + '.entities;';
    query(sql).then(function(results){ 
        res.send(results); 
        console.log(results); 
        endPool;
    });
});



//TODO write all of the routes/

app.listen(port);
