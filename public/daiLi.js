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


    var loading = false;
    function isLoading(){
        return loading;
    }


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
                                        "target": relationObj.toWhom
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
        var n = 0;
        var str = document.getElementById(elemID).value.toLowerCase();

        for(i = 0; i < tempEnts.length; i++){
            if (tempEnts[i][searchField].toLowerCase().includes(str)){
                $scope.filteredEntities[n++] = tempEnts[i];
            }
        }
    }

    // function filterAliasEntities(searchField, elemID){
    //     var tempEnts = $scope.filteredEntities;
    //     $scope.filteredEntities = [];
    //     var n = 0;
    //     var searchTerm = document.getElementById(elemID).value.toLowerCase();
    //
    //     for(i = 0; i < tempEnts.length; i++){
    //
    //         if (tempEnts[i][searchField].indexOf(searchTerm) != -1){
    //             $scope.filteredEntities[n++] = tempEnts[i];
    //         }
    //     }
    // }
    //
    // function filterRelationEntities(elemID, verbElemId){
    //     var tempEnts = $scope.filteredEntities;
    //     $scope.filteredEntities = [];
    //     var n = 0;
    //     var searchTerm = document.getElementById(elemID).value.toLowerCase();
    //     var verb = document.getElementById(verbElemId).value.toLowerCase();
    //
    //     for(i = 0; i < tempEnts.length; i++){
    //         if (tempEnts[i].relations.indexOf(searchTerm) != -1){
    //             $scope.filteredEntities[n++] = tempEnts[i];
    //         }
    //     }
    // }

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