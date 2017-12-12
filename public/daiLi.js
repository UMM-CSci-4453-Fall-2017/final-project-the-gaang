angular.module('daiLi', [])
    .controller('daiLiCtrl', daiLiCtrl)
    .factory('daiLiApi', daiLiApi)
    .constant('apiUrl', 'http://localhost:1337');


function daiLiCtrl($scope, $window, daiLiApi){
    $scope.test = "testing 123...";
    $scope.isLoading = isLoading;
    $scope.allEntities = [];
    $scope.getEntities = getEntities;
    $scope.filteredEntities = [];
    $scope.filterEntities = filterEntities;
    $scope.clickEntity = clickEntity;
    $scope.clearFilters = clearFilters;
    $scope.filterEntitiesAlias = filterEntitiesAlias;
    $scope.filterEntitiesRelation = filterEntitiesRelation;
    $scope.newEntry = newEntry;

    var loading = false;
    function isLoading(){
        return loading;
    }


    // asks the server for all the entities in the database
    function getEntities(){
        daiLiApi.getEnts()
            .success(function(data){
                // Get aliases and relationships for all entities in forEach to avoid async issues;
                data.forEach(function(entity, i){
                    // Set a single entry of allEntities and filteredEntities to this entity, this is necessary to avoid
                    // null-pointer errors.
                    $scope.allEntities.push(entity);
                    $scope.filteredEntities.push(entity);
                    
                    //Get aliases for each entity
                    daiLiApi.getAliases(entity.id)
                        .success(function(result){
                            //Set these as [] so .push exists
                            entity.aliases = [];
                            entity.aliases = [];
                            
                            result.forEach(function(aliasObj){
                                entity.aliases.push(aliasObj.alias);
                                entity.aliases.push(aliasObj.alias);
                            });

                            // Set these because they're the variables we actually care about
                            $scope.allEntities[i].aliases = entity.aliases;
                            $scope.filteredEntities[i].aliases = entity.aliases;
                        }).error(function(){
                            console.error("ERROR: couldn't get aliases for " + entity.name);
                    });

                    // Get relationships for each entity
                    daiLiApi.getRelations(entity.id)
                        .success(function(result) {
                            entity.relationships = [];
                            entity.relationships = [];

                            result.forEach(function (relationObj) {
                                entity.relationships.push(
                                    {
                                        "relation": relationObj.relation,
                                        "target": relationObj.name
                                    });
                            });

                            // Set these because they're the variables we actually care about
                            $scope.allEntities[i].relationships = entity.relationships;
                            $scope.filteredEntities[i].relationships = entity.relationships;
                        }).error(function(){
                            console.error("Couldn't get relationships for " + entity.name);
                    });
                });
            }).error(function(){
                console.log("couldn't get entities");
        })
    }

    function filterEntities(searchField, elemID){
        var tempEnts = $scope.filteredEntities;

        $scope.filteredEntities = [];
        var str = document.getElementById(elemID).value.toLowerCase();

        for(i = 0; i < tempEnts.length; i++){
            if (tempEnts[i][searchField].toLowerCase().includes(str)){
                $scope.filteredEntities.push(tempEnts[i]);
            }
        }
    }

    function filterEntitiesAlias(elemID){
        var tempEnts = $scope.filteredEntities;
        $scope.filteredEntities = [];
        var searchTerm = document.getElementById(elemID).value.toLowerCase();

        tempEnts.forEach(function(entity){
           for (i = 0; i < entity.aliases.length; i++){
               if (entity.aliases[i].toLowerCase().indexOf(searchTerm) != -1){
                   $scope.filteredEntities.push(entity);
                   break;
               }
           }
        });
    }

    function filterEntitiesRelation(elemID, verbElemId){
        var tempEnts = $scope.filteredEntities;
        $scope.filteredEntities = [];
        var searchTarget = document.getElementById(elemID).value.toLowerCase();
        var verb = document.getElementById(verbElemId).value.toLowerCase();

        for(var i = 0; i < tempEnts.length; i++){
            var relations = tempEnts[i].relationships;
            for(var j = 0; j < relations.length; j++){
                if (relations[j].target.toLowerCase().indexOf(searchTarget) != -1
                        && relations[j].relation.toLowerCase().indexOf(verb) != -1){
                    $scope.filteredEntities.push(tempEnts[i]);
                    break;
                }
            }
        }
    }

    // when an entity is clicked, go to that entity's page
    function clickEntity(id){
        var host = $window.location.host;
        $window.location.href = "http://" + host + "/entity/" + id;
    }

    function clearFilters(){
        $scope.filteredEntities = $scope.allEntities;
        document.getElementById("searchName").value = "";
        document.getElementById("searchAbilities").value = "";
        document.getElementById("searchDesc").value = "";
        document.getElementById("searchLoc").value = "";
        document.getElementById("searchHist").value = "";
    }

    function newEntry(){
        var host = $window.location.host;
        $window.location.href = "http://" + host + "/newEntry";
    }

    getEntities();
}

function daiLiApi($http, apiUrl){
    return {
        getEnts: function() {
            var url = apiUrl + '/getEntity/all';
            return $http.get(url);
        },
        getAliases: function(id){
            var url = apiUrl + "/getAliases/"+id;
            return $http.get(url);
        },
        getRelations: function(id){
            var url = apiUrl + "/getRelationships/"+id;
            return $http.get(url);
        }
    };
};