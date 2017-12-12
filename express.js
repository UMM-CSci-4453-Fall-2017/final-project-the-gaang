var express = require('express');

mysql=require('mysql');
var creds= require('./credentials.json');
//var mongo = require('mongodb');
Promise = require('bluebird');
var using = Promise.using;
//const bodyParser = require('body-parser');


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

app.get('/entity*', function(req, res){
    res.sendFile(__dirname + '/public/entity.html');
});

app.get('/newEntry', function(req, res){
    res.sendFile(__dirname + '/public/newEntry.html')
});


app.get("/getEntity/:id", function(req, res){
    var id = req.params.id;
    if(id == "all"){
        var sql = 'Select * from '+db+'.entities;';
    } else {
        var sql = 'Select * from '+db+'.entities where id='+id+';';
    }

    query(sql)
        .then(function(results){
            res.send(results);
           // console.log(results);
           // endPool;
    });
});

app.get("/getAliases/:id", function(req, res){
    var id = req.params.id;
    var sql = 'select * from '+db+'.aliases where subjectID='+id+';';

    query(sql)
        .then(function(results){
            res.send(results);
            console.log(results);
           // endPool();
        });
});

app.get("/submit", function(req, res){
    var name = '"' + req.param('name') + '"';
    var history = '"' + req.param('history') + '"';
    var desc = '"' + req.param('description') + '"';
    var location = '"' + req.param('location') + '"';
    var abilities = '"' + req.param('abilities') + '"';

    var sql = "insert into "+db+".entities (name, history, description, location, abilities) values ("+name+", "+history+", "+
        desc+", "+location+", "+abilities+");";

    query(sql).then(function(result){
        res.send(result);
    });
});

app.get("/submitAlias", function(req, res){
    var id = req.param('id');
    var alias = '"' + req.param('alias') + '"';
    var sql = "insert into "+db+".aliases values ("+id+", "+alias+");";

    query(sql).then(function(results){
        res.send(results);
    });
});

app.get("/getRelationships/:id", function(req, res){
    var id = req.params.id;
    var sql = 'select relationships.relation, entities.name, entities.id' +
        ' from '+db+'.relationships inner join '+db+'.entities on ' +
        'relationships.toWhom=entities.id where relationships.subjectID='+id+';';

    query(sql)
        .then(function(results){
            res.send(results);
            console.log(results);
          //  endPool();
        });
});

app.get("/submitRelationship", function (req, res) {
    var id = req.param('id');
    var verb = '"' + req.param('verb') + '"';
    var target = '"' + req.param('target') + '"';
    var findTargetId = "select id from "+db+".entities where name="+target+" limit 1;";

    //TODO: consider checking that this id exists
    query(findTargetId).then(function(result){
        var targetId = result[0].id;
        var insertSql = "insert into "+db+".relationships values ("+id+", "+verb+", "+targetId+");";

        query(insertSql).then(function(results){
            res.send(results);
        })
    })
});

app.listen(port);

