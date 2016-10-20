"use strict";

//Define the controller module, assign its dependencies, assign the function.
var module = angular.module('indexCtrls', []);

//The actual function that will act as the controller
module.controller('indexCtrl', ['$scope', '$location', '$http', function indexCtrl($scope, $location, $http) {

    $scope.test = "O dimitris einai papari";
    //The login function
    function login() {

        // //post request, to exchange the password for a token
        // //grant_type set to password because we are sending one(duh)
        // //client_id and client_secret will be predefined
        // //get the email from the scope, assign it as username
        // // get the password from the scope assign it to the password var
        // $http.post("/api/oauth/token", {
        //     grant_type: "password",
        //     client_id: "Axxh45u4bdajGDshjk21n",
        //     client_secret: "d13e~223~!!@$5dasd",
        //     username: $scope.email,
        //     password: $scope.password
        // }).then(function success(response) {
        //
        //
        // }, function error(status) {
        //
        // });
        $location.url('/main');

    }

    //Same as the login
    function register() {

        $location.url('/register');
    }

    $scope.login = login;
    $scope.register = register;


}]);



