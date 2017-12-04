angular.module('daiLi', [])
    .controller('daiLiCtrl', daiLiCtrl)
    .factory('daiLiApi', daiLiApi)
    .constant('apiUrl', 'http://localhost:1337');

function daiLiCtrl($scope, daiLiApi){
    $scope.test = "testing 123";
    $scope.isLoading = isLoading;

    var loading = false;
    function isLoading(){
        return loading;
    }

}

function daiLiApi($http, apiUrl){
    return {};
};