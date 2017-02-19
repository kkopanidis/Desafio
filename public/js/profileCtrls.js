"use strict";

//Define the controller module, assign its dependencies, assign the function.
var profCtrl = angular.module('profCtrl', []);

//The actual function that will act as the controller
profCtrl.controller('profCtrl', ['$scope', '$location', '$http', '$cookies', '$routeParams',
    function profCtrl($scope, $location, $http, $cookies, $routeParams) {


        function getFollowers() {
            if ($scope.own || !$routeParams.id) {
                $http.get("/api/users/connect", {
                    headers: {
                        'Authorization': 'Bearer ' + $cookies.get('auth_0')
                    }
                }).then(function success(response) {
                    if (response.data.length > 0 && response.data[0].num) {
                        $scope.followers = response.data[0].num;
                    } else {
                        $scope.followers = 0;
                    }

                }, function error(error) {

                });
            }
        }

        function status() {
            $http.get("/api/users/connect/" + $routeParams.id, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                if (response.data === "Not followed")
                    $scope.followStatus = "follow";
                else
                    $scope.followStatus = "unfollow"
            }, function error(error) {
                window.alert("Failed");
            });
        }

        function own() {
            $http.get("/api/users/", {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                $scope.own = $routeParams.id === response.data.id;

            }, function error(error) {

            });
        }

        function info(id) {
            $http.get("/api/users/" + (id === undefined ? "" : id), {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                $scope.info = response.data;

            }, function error(error) {

            });
        }


        if ($routeParams.id) {
            own();
            status();
            info($routeParams.id);

            $http.get("/api/des/gaunlet/" + $routeParams.id, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                $scope.challenges = response.data;
            }, function error(error) {

            });
        } else {
            $scope.own = true;
            info();

            $http.get("/api/des/gaunlet/self", {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                $scope.challenges = response.data;
            }, function error(error) {

            });
        }
        getFollowers();


        $scope.follow = function () {
            $http.post("/api/users/connect/" + $routeParams.id, {}, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                status();
            }, function error(error) {
                window.alert("Failed");
            });
        };

        $scope.updateInfo = function () {
            $http.post("/api/users/", $scope.info, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                window.alert("All done!");
            }, function error(error) {
                window.alert("Failed");
            });
        }

    }]
);