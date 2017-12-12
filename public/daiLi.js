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
                $scope.allEntities = data;

                if($scope.filteredEntities.length == 0){
                    $scope.filteredEntities = data;
                }
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
        getEnts: function () {
            var url = apiUrl + '/getEntity/all';
            return $http.get(url);
        }
    };
};