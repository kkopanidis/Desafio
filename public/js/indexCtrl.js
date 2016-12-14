"use strict";

//Define the controller module, assign its dependencies, assign the function.
var module = angular.module('indexCtrls', []);

//The actual function that will act as the controller
module.controller('indexCtrl', ['$scope', '$location', '$http', '$cookies', 'userSrvc', indexCtrl]);

//Basically the login controller
function indexCtrl($scope, $location, $http, $cookies, userSrvc) {

    //Check if there is a cookie set and if it is valid
    userSrvc.cookieLog(function (error, response) {
        //if no error, redirecto to main
        if (!error) {
            $location.url("/main");
        }
    });

    //Login
    function login() {
        userSrvc.login($scope.user.email,
            $scope.user.password, function (error, response) {
                if (!error) {
                    $location.url("/main")
                } else {
                    window.alert("Failed!");
                }

            });
    }

    //Same as the login
    function register_button() {
        $location.url('/register');
    }

    function register() {
        $http.post("/api/users/register", $scope.user)
            .then(function success(response) {
                window.alert("Success!");
                $location.url('/');
            }, function error(status) {
                window.alert("Failed :(");

            });
    }


    $scope.login = login;
    $scope.register_button = register_button;
    $scope.register = register;
}


