angular.module("entity", [])
    .controller("entityCtrl", entityCtrl)
    .factory("entityApi", entityApi)
    .constant('apiUrl', 'http://localhost:1337');

function entityCtrl($scope, $location, entityApi){
    $scope.test = "testing 123";
    $scope.idEntity;
    $scope.aliases;
    $scope.relationships;

    function processUrl(){
        var url = $location.absUrl();
        var index = url.lastIndexOf("/");
        var id = url.substring(index + 1, url.length);

        entityApi.getEntity(id)
            .success(function(data){
                $scope.idEntity = data[0];
            }).error(function(){
                console.log("Failed to retrieve entity information");
        })
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