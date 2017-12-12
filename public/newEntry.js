angular.module('newEntry', [])
    .controller('newEntryCtrl', newEntryCtrl)
    .factory('newEntryApi', newEntryApi)
    .constant('apiUrl', 'http://localhost:1337');

function newEntryCtrl($scope, $window, newEntryApi){
    $scope.submit = submit;
    $scope.aliases = [{}];
    $scope.addAlias = addAlias;
    $scope.relations = [{}];
    $scope.addRelation = addRelation;
    $scope.home = home;

    /*
     * pulls the name, description, location, history, and abilities from the client
     * and send them to the server to be added to the database
     *
     */
    function submit(){
        var name = document.getElementById("name").value;
        var description = document.getElementById("description").value;
        var location = document.getElementById("location").value;
        var history = document.getElementById("history").value;
        var abilities = document.getElementById("abilities").value;
        var id;

        //Add the entry to entities
        newEntryApi.submitEntity(name, description, location, history, abilities)
            .success(function(data){
                id = data.insertId;
                var aliases = document.getElementsByClassName('aliasClass');
                var relationVerbs = document.getElementsByClassName('relationClass');
                var relationPeople = document.getElementsByClassName('personClass');

                console.log("id: " + id);

                //Add each alias individually
                for(i = 0; i < aliases.length; i++){
                    var alias = aliases[i].value;

                    if(alias.length > 0) {
                        newEntryApi.submitAlias(id, alias)
                            .success(function (data) {
                            }).error(function () {
                            console.log("Failed to add alias " + alias);
                        });
                    }
                }

                //Add the relationships individually
                for(i = 0; i < $scope.relations.length; i++){
                    var verb = relationVerbs[i].value;
                    var person = relationPeople[i].value;

                    newEntryApi.submitRelation(id, verb, person).success(function(data){
                        console.log("successfully submitted relation verb: " + verb + " target: " + person);
                    }).error(function(){
                        console.log("failed to submit relationship verb: " + verb + " target: " + person);
                    })
                }
            }).error(function(){
                console.log("Could not submit new entry")
        });

    }

    // sends an alias to the server to be added to the database
    function addAlias(){
        $scope.aliases[$scope.aliases.length] = {};
    }

    // sends a relationship to the server to be added to the database
    function addRelation(){
        $scope.relations[$scope.relations.length] = {};
    }

    function home(){
        var host = $window.location.host;
        $window.location.href = "http://" + host;
    }
}

function newEntryApi($http, apiUrl){
    return {
        submitEntity: function(name, description, location, history, abilities){
            var url = apiUrl + "/submit?name="+name+"&description="+description+"&location="+location
                +"&history="+history+"&abilities="+abilities;
            return $http.get(url);
        },
        submitAlias: function(id, alias){
            var url = apiUrl + "/submitAlias?id="+id+"&alias="+alias;
            return $http.get(url);
        },
        submitRelation: function(id, verb, target){
            var url = apiUrl + "/submitRelationship?id="+id+"&verb="+verb+"&target="+target;
            return $http.get(url);
        }
    }
}