"use strict";

//Define the controller module, assign its dependencies, assign the function.
var module = angular.module('MainCtrls', []);

//The actual function that will act as the controller
module.controller('mainCtrl', ['$scope', '$location', '$http', '$cookies',
    function indexCtrl($scope, $location, $http, $cookies) {

        $http.get("/api/users/", {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('auth_0')
            }
        }).then(function success(response) {
            $scope.name = response.data.username
        }, function error(error) {

        })

}]);



