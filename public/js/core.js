// public/core.js
var desafio = angular.module('desafio', ['ngRoute', 'indexCtrls','ngMaterial','ngAnimate', 'ngCookies', 'ngSanitize']);


//All will be changed
desafio.config(['$routeProvider', '$locationProvider', function ($routeProvider,
                                                                  $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/index.html',
        controller: 'indexCtrl'
    }).when('/register', {
        templateUrl: '/partials/register.html',
        controller: 'indexCtrl'
    }).otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
}]);
