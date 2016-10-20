"use strict";

//Define the controller module, assign its dependencies, assign the function.
var module = angular.module('indexCtrls', []);

//The actual function that will act as the controller
module.controller('indexCtrl', ['$scope', '$location', '$http', function indexCtrl($scope, $location, $http) {

    //The login function
    function login() {

        //post request, to exchange the password for a token
        //grant_type set to password because we are sending one(duh)
        //client_id and client_secret will be predefined
        //get the email from the scope, assign it as username
        // get the password from the scope assign it to the password var
        $http.post("/api/oauth/token", {
            grant_type: "password",
            client_id: "Axxh45u4bdajGDshjk21n",
            client_secret: "d13e~223~!!@$5dasd",
            username: $scope.user.email,
            password: $scope.user.password
        }).then(function success(response) {

            window.alert("Success!");
            $location.url("/");
        }, function error(status) {
            window.alert("Failed :(");
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
}]);



