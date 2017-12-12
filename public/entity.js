angular.module("entity", [])
    .controller("entityCtrl", entityCtrl)
    .factory("entityApi", entityApi)
    .constant('apiUrl', 'http://localhost:1337');

function entityCtrl($scope, $location, $window, entityApi){
    $scope.test = "testing 123";
    $scope.processUrl = processUrl;
    $scope.idEntity;
    $scope.aliases = [];
    $scope.relationships = [];
    $scope.clickEntity = clickEntity;

    /*
     * pulls info from the URL and uses it to ask the server for the entity
     * info, the entity relationships, and the entity aliases
     */
    function processUrl(){
        var url = $location.absUrl();
        var index = url.lastIndexOf("/");
        var id = url.substring(index + 1, url.length);

        entityApi.getEntity(id)
            .success(function(data){
                $scope.idEntity = data[0];
            }).error(function(){
                console.log("Failed to retrieve entity information");
        });

        entityApi.getRelationships(id)
            .success(function(data){
                $scope.relationships = [];

                for (i = 0; i < data.length; i++){
                    $scope.relationships[i] = data[i];
                }
                console.log($scope.relationships);
            }).error(function(){
                console.log("Failed to retrieve relationship information");
            });

        entityApi.getAliases(id)
            .success(function(data){
                $scope.aliases = data;
                console.log();
            }).error(function(){
                console.log("Failed to retrieve alias information");
            });
    }

    // when an entity is clicked (in the relations area), go to that entity's page
    function clickEntity(id){
        var host = $window.location.host;
        $window.location.href = "http://" + host + "/entity/" + id;
    }

    processUrl();
}

function entityApi($http, apiUrl){
    return {
        getEntity: function(id){
            var url = apiUrl + "/getEntity/" + id;
            return $http.get(url);
        },
        getAliases: function (id) {
            var url = apiUrl + "/getAliases/" + id;
            return $http.get(url);
        },
        getRelationships: function (id) {
            var url = apiUrl + "/getRelationships/" + id;
            return $http.get(url);
        }
    }
}