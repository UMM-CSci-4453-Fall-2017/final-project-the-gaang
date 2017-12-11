angular.module('newEntry', [])
    .controller('newEntryCtrl', newEntryCtrl)
    .factory('newEntryApi', newEntryApi)
    .constant('apiUrl', 'http://localhost:1337');

function newEntryCtrl($scope, entityApi){

}

function newEntryApi($http, apiUrl){
    return {

    }
}