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
            $scope.name = response.data.username;
            $scope.info = UserInfo.findById(response.data.info);
        }, function error(error) {

        });


        $http.get("/api/des/self", {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('auth_0')
            }
        }).then(function success(response) {
            $scope.challenges = response.data
        }, function error(error) {

        });

        $http.get("/api/des/flow", {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('auth_0')
            }
        }).then(function success(response) {
            $scope.challengeflow = response.data;
            var data = [];
            for (var i = 0, j = response.data.length; i < j; i++)
                data.push(response.data[i]._id);
            $http.post("/api/des/likes/user", {challenges: data}, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                for (var k = 0, p = response.data.length; k < p; k++) {
                    document.getElementById(response.data[k].challenge).style.color = "#25d5ed";
                }
            }, function error(error) {
                window.alert(error)
            });
            $http.post("/api/des/likes/all", {challenges: data}, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                for (var k = 0, p = response.data.length; k < p; k++) {
                    document.getElementById(response.data[k].challenge + "_count").innerHTML = response.data[k].likes;
                }
            }, function error(error) {
                window.alert(error)
            });
        }, function error(error) {

        });


        $scope.profile_button = function () {
            $location.url('/profile');
        };

        $scope.desafio_button = function () {
            $location.url('/main');
        };

        $scope.search = function () {
            document.getElementById("search_bar").style.display = "inline";
            var element = document.getElementById("search_box");
            element.focus();

            function focusChangeListener() {
                document.getElementById("search_bar").style.display = "none";
                document.getElementById("search_button").style.display = "inline";
                element.removeEventListener('blur', focusChangeListener, false);
            }

            element.addEventListener('blur', focusChangeListener, false);
            document.getElementById("search_button").style.display = "none";
        };


        $scope.like = function (id) {
            $http.post("/api/des/like/" + id, {}, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                if (document.getElementById(id).style.color === "rgb(37, 213, 237)") {
                    document.getElementById(id).style.color = "black";
                } else {
                    document.getElementById(id).style.color = "#25d5ed";
                }
            }, function error(error) {
                console.log(error)
            });
        };

        $scope.getComments = function (id) {
            var elem = document.getElementById(id + "_com");
            if (elem.style.display !== "none") {
                elem.style.display = "none";
            } else {
                elem.style.display = "";
            }


            var item;
            for (var i = 0, j = $scope.challengeflow.length; i < j; i++) {
                if ($scope.challengeflow[i]._id === id) {
                    item = i;
                    break;
                }
            }

            $http.get("/api/des/comments/" + id, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                $scope.challengeflow[item].comments = response.data
            }, function error(error) {

            });
        };


        $scope.comment = function (id) {
            var com = this.newUserCom;
            this.newUserCom = "";
            $http.post("/api/des/comments/" + id, {comment: com}, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                $scope.getComments(id);
            }, function error(error) {

            });
        };

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

module.controller('SrchCtrl', ['$http', '$cookies', '$q', SrchCtrl]);

function SrchCtrl($http, $cookies, $q) {

    function querySearch(query) {
        var defered;
        defered = $q.defer();

        $http.post("/api/search/", {searchText: query}, {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('auth_0'),
                'Content-Type': 'application/json'
            }
        }).then(function success(response) {
            defered.resolve(response.data)
        }, function error(error) {
            //window.alert("Failed");
            defered.resolve([]);
        });


        return defered.promise;

    }

    var self = this;

    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;


    function searchTextChange(text) {

    }

    function selectedItemChange(item) {

    }
}
