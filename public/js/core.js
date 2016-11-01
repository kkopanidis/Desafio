// public/core.js
var desafio = angular.module('desafio', ['ngRoute', 'indexCtrls','MainCtrls','ngMaterial','ngAnimate', 'ngCookies', 'ngSanitize']);


//All will be changed
desafio.config(['$routeProvider', '$locationProvider', function ($routeProvider,
                                                                  $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/index.html',
        controller: 'indexCtrl'
    }).when('/register', {
        templateUrl: '/partials/register.html',
        controller: 'indexCtrl'
    }).when('/main', {
        templateUrl: '/partials/main_feed.html',
        controller: 'mainCtrl',
    }).when('/profile', {
        templateUrl: '/partials/profile.html',
        controller: 'mainCtrl'
    }).otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
}]);
