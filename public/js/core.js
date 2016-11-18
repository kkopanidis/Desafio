// public/core.js
var desafio = angular.module('desafio', ['ngRoute', 'indexCtrls','MainCtrls','profCtrl','feedCtrl',
    'ngMaterial','ngAnimate', 'ngCookies', 'ngSanitize']);


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
        templateUrl: '/partials/main.html',
        controller: 'mainCtrl'
    }).when('/profile', {
        templateUrl: '/partials/main.html',
        controller: 'mainCtrl'
    }).when('/profile/:id', {
        templateUrl: '/partials/main.html',
        controller: 'mainCtrl'
    }).otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
}]);
