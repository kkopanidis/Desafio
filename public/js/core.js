// public/core.js
var desafio = angular.module('desafio', ['ngRoute', 'indexCtrls', 'MainCtrls', 'profCtrl', 'feedCtrl',
    'ngMaterial', 'ngAnimate', 'ngCookies', 'ngSanitize', 'userSrvc']);


//All will be changed
desafio.config(['$routeProvider', '$locationProvider',
    '$mdThemingProvider','$compileProvider', function ($routeProvider,
                                    $locationProvider, $mdThemingProvider,$compileProvider) {
        $mdThemingProvider.definePalette('amazingPaletteName', {
            '50': '#30292F',
            '100': '#30292F',
            '200': '#30292F',
            '300': '#30292F',
            '400': '#30292F',
            '500': '#30292F',
            '600': '#30292F',
            '700': '#30292F',
            '800': '#30292F',
            '900': '#30292F',
            'A100': '#30292F',
            'A200': '#30292F',
            'A400': '#30292F',
            'A700': '#30292F',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light

            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|ftp|blob):|data:image\//);
        $mdThemingProvider.definePalette('accentPalette', {
            '50': '#F1A208',
            '100': '#F1A208',
            '200': '#F1A208',
            '300': '#F1A208',
            '400': '#F1A208',
            '500': '#F1A208',
            '600': '#F1A208',
            '700': '#F1A208',
            '800': '#F1A208',
            '900': '#F1A208',
            'A100': '#F1A208',
            'A200': '#F1A208',
            'A400': '#F1A208',
            'A700': '#F1A208',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light

            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('amazingPaletteName')
            .accentPalette('accentPalette');
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
