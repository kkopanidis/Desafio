// public/core.js
var main_app = angular.module('desafio', ['ngRoute', 'ngAnimate', 'ngMaterial',
    'ngCookies', 'ngSanitize']);


//All will be changed
main_app.config(['$routeProvider', '$locationProvider', function ($routeProvider,
                                                                  $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/index.html',
        controller: 'IndexCtrl'
    }).when('/register', {
        templateUrl: '/partials/register.html',
        controller: 'IndexCtrl'
    }).otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
}]);