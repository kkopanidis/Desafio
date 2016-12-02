"use strict";

angular.module('userSrvc', [])
    .factory('userSrvc', ['$window', '$cookies', '$http', function (win, $cookies, $http) {
        var data;
        var basic = {};

        function setCookies(expires, data) {
            var expireDate = new Date();
            expireDate.setSeconds(expires);
            var expireDate_2 = new Date();
            expireDate_2.setDate(expireDate_2.getDate() + 100);
            $cookies.put('auth_0', data[0], {
                'expires': expireDate
            });
            $cookies.put('auth_0_ref', data[1], {
                'expires': expireDate
            });
        }

        function getCookies() {
            return $cookies.get('auth_0');
        }

        basic.getCookies = getCookies;

        function getUserData(callback) {
            if (!getCookies()) {
                callback(null);
            }
            else {
                $http.get("/api/users/", {
                    headers: {'Authorization': 'Bearer ' + getCookies()}
                }).then(function success(resp) {
                    callback(resp.data);
                }, function error(error) {
                    callback(error.data);
                });
            }

        }

        basic.userData = function (callback) {
            if (!data) {
                getUserData(callback);
            }
            else {
                callback(data);
            }
        };

        basic.login = function (username, password, callback) {
            $http.post("/api/oauth/token", {
                grant_type: "password",
                client_id: "Axxh45u4bdajGDshjk21n",
                client_secret: "d13e~223~!!@$5dasd",
                username: username,
                password: password
            }).then(function success(response) {
                setCookies(response.data.expires_in, [response.data.access_token, response.data.refresh_token]);
                callback(null, true);
            }, function error(status) {
                callback(status.data.error_description, null);
            });

        };

        basic.cookieLog = function (callback) {
            if ($cookies.get('auth_0')) {
                $http.get("/api/users/", {
                    headers: {
                        'Authorization': 'Bearer ' + getCookies()
                    }
                }).then(function success(response) {
                    callback(null, response.data);
                }, function error(error) {
                    $cookies.remove('auth_0');
                    callback(error.data, null);
                });

            }
            else if ($cookies.get('auth_0_ref')) {
                $http.post("/api/oauth/token", {
                    grant_type: "refresh_token",
                    client_id: "Axxh45u4bdajGDshjk21n",
                    client_secret: "d13e~223~!!@$5dasd",
                    refresh_token: $cookies.get('auth_0_ref')
                }, function success(response) {
                    setCookies(response.data.expires_in, [response.data.access_token, response.data.refresh_token]);
                    basic.cookieLog(null, callback);
                }, function error(status) {
                    callback(status.data, null);
                });
            } else {
                callback("Error", null);
            }
        };

        basic.logout = function (callback) {
            if ($cookies.get('auth_0')) {
                $http.post("/api/users/logout", {}, {
                    headers: {
                        'Authorization': 'Bearer ' + getCookies()
                    }
                }).then(function success(response) {
                    $cookies.remove('auth_0');
                    $cookies.remove('auth_0_ref');
                    callback(null, true);
                }, function error(error) {
                    callback(error, false);
                });
            }
        };


        basic.passChange = function (old, newp, callback) {
            if ($cookies.get('auth_0')) {
                $http.post("/api/users/change", {old: old, new: newp}, {
                    headers: {
                        'Authorization': 'Bearer ' + getCookies()
                    }
                }).then(function success(response) {
                    callback(response.data);
                }, function error(error) {
                    callback(error.data);
                });
            }
        };

        return basic;

    }]);