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

    var loading = false;
    function isLoading(){
        return loading;
    }

    function getEntities(){
        daiLiApi.getEnts()
            .success(function(data){
                $scope.allEntities = data;

                if($scope.filteredEntities.length == 0){
                    $scope.filteredEntities = data;
                }
            }).error(function(){
                console.log("couldn't get entities");
        })
    }

    function filterEntities(){
        $scope.filteredEntities = [];
        var n = 0;
        var str = document.getElementById("searchTerm").value.toLowerCase();

        for(i = 0; i < $scope.allEntities.length; i++){
            if ($scope.allEntities[i].name.toLowerCase().includes(str)){
                $scope.filteredEntities[n++] = $scope.allEntities[i];
            }
        }
    }

    function clickEntity(id){
        var host = $window.location.host;
        $window.location.href = "http://" + host + "/entity/" + id;
    }

    getEntities();
}

function daiLiApi($http, apiUrl){
    return {
        getEnts: function () {
            var url = apiUrl + '/getEntity/all';
            return $http.get(url);
        }
    };
};