// public/core.js
var main_app = angular.module('desafio', ['ngRoute', 'ngAnimate',
    'ngCookies', 'ngSanitize']);


//All will be changed
main_app.config(['$routeProvider', '$locationProvider', function ($routeProvider,
                                                                  $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partial/index.html',
        controller: 'IndexCtrl'
    }).otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
}]);