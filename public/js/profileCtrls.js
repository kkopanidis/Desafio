"use strict";

//Define the controller module, assign its dependencies, assign the function.
var module = angular.module('ProfileCtrls', []);

//The actual function that will act as the controller
module.controller('profileCtrl', ['$scope', '$location', '$http', '$cookies',
    function profileCtrl($scope, $location, $http, $cookies) {

        $http.get("/api/users/", {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('auth_0')
            }
        }).then(function success(response) {
            UserInfo.findById(response.data.info);
        }, function error(error) {

        });

    }]);