"use strict";

//Define the controller module, assign its dependencies, assign the function.
var profCtrl = angular.module('profCtrl', []);

//The actual function that will act as the controller
profCtrl.controller('profCtrl', ['$scope', '$location', '$http', '$cookies', '$routeParams', '$mdDialog',
    function profCtrl($scope, $location, $http, $cookies, $routeParams, $mdDialog) {
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

            $http.get("/api/des/gauntlet/" + $routeParams.id, {
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

            $http.get("/api/des/gauntlet/self", {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                $scope.challenges = response.data;
            }, function error(error) {

            });
        }

        $scope.answer = function (id, answer) {
            $http.post("/api/des/gauntlet/" + id, {action: answer}, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                $scope.challenge.status.status = null
            }, function error(error) {
                window.alert("Error!");
            });
        };

        getFollowers();

        function ShowFollowersController($scope, $mdDialog) {
            $http.get("/api/users/connect", {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                $scope.data = response.data[0].follower;
            }, function error(error) {
                window.alert("Failed");
            });
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };
        }

        $scope.showFollowers = function (ev, id) {
            $mdDialog.show({
                controller: ShowFollowersController,
                templateUrl: 'partials/followers_list.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            }).then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

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
        };
        var gauntletID;

        $scope.showCompleteGauntlet = function (ev, id) {
            gauntletID = id;
            $mdDialog.show({
                controller: CompleteDialogController,
                templateUrl: 'partials/complete_diag.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            }).then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        function CompleteDialogController($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                let input = document.getElementById("proof_input");
                let self = this;
                if (input.files && input.files[0]) {
                    let reader = new FileReader();

                    reader.onloadend = function (e) {
                        //Send the checked users and the challenge id to the server
                        $http.post("/api/des/gauntlet/" + gauntletID, {
                            action: answer,
                            proof: (e.target.result.split(','))[1]
                        }, {
                            headers: {
                                'Authorization': 'Bearer ' + $cookies.get('auth_0')
                            }
                        }).then(function success(response) {
                            window.alert("Success");
                        }, function error(error) {
                            window.alert("Failed");
                        });
                        $mdDialog.hide();

                    };
                    reader.readAsDataURL(input.files[0]);
                } else {
                    window.alert("You need to provide proof!");
                }


            };
        }

    }]
);