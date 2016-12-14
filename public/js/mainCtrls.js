"use strict";

//Define the controller module, assign its dependencies, assign the function.
var module = angular.module('MainCtrls', []);

//The actual function that will act as the controller
module.controller('mainCtrl', ['$scope', '$location', '$http', '$cookies', '$mdDialog', 'userSrvc',
    function indexCtrl($scope, $location, $http, $cookies, $mdDialog, userSrvc) {

        var activeSendId;
        userSrvc.cookieLog(function (error, response) {
            if (error) {
                $location.url("/");
            } else {
                $scope.name = response.username;
                $scope.info = UserInfo.findById(response.info);
            }
        });

        //Depending on the url show a different partial on the main.html
        if ($location.url() == "/main") {
            $scope.loc = 'mainFeed';
        } else {
            $scope.loc = 'profile';
        }

        $scope.profile_button = function () {
            $location.url('/profile');
        };

        $scope.desafio_button = function () {
            $location.url('/main');
        };

        $scope.logout = function () {
            userSrvc.logout(function (err, result) {
                if (err) {
                    window.alert("Something went wrong :/");
                } else {
                    $location.url("/");
                }
            });
        };

        //Once search is clicked show the search input
        $scope.search = function () {
            var element = document.querySelector("#search_box");
            document.getElementById("search_bar").style.display = "inline";
            element.focus();

            //If the search input loses focus collapse it
            function focusChangeListener() {
                if (document.activeElement === element)
                    return;
                document.getElementById("search_bar").style.display = "none";
                document.getElementById("search_button").style.display = "inline";
                element.removeEventListener('blur', focusChangeListener, false);
            }

            element.addEventListener('blur', focusChangeListener, false);
            document.getElementById("search_button").style.display = "none";
        };


        //Show the new challenge dialog
        $scope.showNewChallenge = function (ev) {

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'partials/dialog1.tmpl.html',
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

        //Show the send challenge dialog
        $scope.showSendChallenge = function (ev, id) {
            activeSendId = id;
            $mdDialog.show({
                controller: SendDialogController,
                templateUrl: 'partials/send_list.tmpl.html',
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

        function SendDialogController($scope, $mdDialog) {
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

            $scope.answer = function (answer) {
                var send = [];
                //Iterate over the elements and keep the checked ones
                for (var i = 0, j = $scope.data.length; i < j; i++) {
                    if ($scope.data[i].send)
                        send.push($scope.data[i]);
                }
                //Send the checked users and the challenge id to the server
                $http.post("/api/des/gaunlet", [send, activeSendId], {
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
        }


    }]);

module.controller('SrchCtrl', ['$http', '$cookies', '$q', '$location', SrchCtrl]);

function SrchCtrl($http, $cookies, $q, $location) {

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

    //Go to selected user profile
    function selectedItemChange(item) {
        if (item.username)
            $location.url("/profile/" + item._id);

    }
}
