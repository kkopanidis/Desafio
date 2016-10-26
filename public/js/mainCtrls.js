"use strict";

//Define the controller module, assign its dependencies, assign the function.
var module = angular.module('MainCtrls', []);

//The actual function that will act as the controller
module.controller('mainCtrl', ['$scope', '$location', '$http', '$cookies', '$mdDialog',
    function indexCtrl($scope, $location, $http, $cookies, $mdDialog) {

        $http.get("/api/users/", {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('auth_0')
            }
        }).then(function success(response) {
            $scope.name = response.data.username
        }, function error(error) {

        });

        $scope.showNewChallenge = function (ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'partials/dialog1.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        function DialogController($scope, $mdDialog) {

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide();
                $http.post("/api/des/", $scope.challenge, {
                    headers: {
                        'Authorization': 'Bearer ' + $cookies.get('auth_0')
                    }
                }).then(function success(response) {
                   window.alert("Success");
                }, function error(error) {
                    window.alert("Failed");
                });


            };
        }

    }]);



