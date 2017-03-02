"use strict";

//Define the controller module, assign its dependencies, assign the function.
var feedCtrl = angular.module('feedCtrl', []);


//The actual function that will act as the controller
feedCtrl.controller('feedCtrl', ['$scope', '$location', '$http', '$cookies',
    function feedCtrl($scope, $location, $http, $cookies) {
        $http.get("/api/des/self", {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('auth_0')
            }
        }).then(function success(response) {
            $scope.challenges = response.data
        }, function error(error) {

        });
        $http.get("/api/des/gauntlet/review", {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('auth_0')
            }
        }).then(function success(response) {
            $scope.reviewFlow = response.data
        }, function error(error) {

        });

        function getOwnLikes(data) {
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
        }

        function getLikes(data) {
            $http.post("/api/des/likes/all", {challenges: data}, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                let id;
                for (let k = 0, p = response.data.length; k < p; k++) {

                    if (response.data[k].challenge instanceof Array) {
                        id = response.data[k].challenge[0];
                    }
                    else {
                        id = response.data[k].challenge;
                    }
                    document.getElementById(id + "_count").innerHTML = "Like (" + response.data[k].likes + ")";
                }
            }, function error(error) {
                window.alert(error)
            });
        }

        $http.get("/api/des/flow", {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('auth_0')
            }
        }).then(function success(response) {
            $scope.challengeflow = response.data;
            let data = [], i = 0, j = response.data.length;

            for (; i < j; i++)
                data.push(response.data[i]._id);
            getOwnLikes(data);
            getLikes(data);

        }, function error(error) {

        });

        $http.get("/api/des/gauntlet", {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('auth_0')
            }
        }).then(function success(response) {
            $scope.gaunletflow = response.data;
        }, function error(error) {

        });


        $scope.like = function (id) {
            $http.post("/api/des/like/" + id, {}, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('auth_0')
                }
            }).then(function success(response) {
                if (document.getElementById(id).style.color === "rgb(37, 213, 237)") {
                    document.getElementById(id).style.color = "black";
                    document.getElementById(id + "_count").innerHTML =
                        "Like (" + (parseInt(document.getElementById(id + "_count").innerHTML.substr(6)) - 1) + ")";
                } else {
                    document.getElementById(id).style.color = "#25d5ed";
                    document.getElementById(id + "_count").innerHTML =
                        "Like (" + (parseInt(document.getElementById(id + "_count").innerHTML.substr(6)) + 1) + ")";
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


    }]
);