'use strict';

// Declare app level module which depends on filters, and services
var spatwork = angular.module('spatwork', ['spatwork.controllers', 'spatworkFilters']);

//App controllers
var controllers = angular.module('spatwork.controllers', ['restangular']);

spatwork.config(function($routeProvider, RestangularProvider) {

    $routeProvider
        .when('/home',
        {
            templateUrl: 'partials/home.html',
            controller: 'PlayerCtrl'
        });

    $routeProvider
        .when('/ranking', {
            templateUrl: 'partials/ranking.html',
            controller: 'RankCtrl'
    });

    $routeProvider
        .when('/game', {
            templateUrl: 'partials/game.html',
            controller: 'GameCtrl'
    });

    $routeProvider
        .when('/about', {
            templateUrl: 'partials/about.html'
    });

    $routeProvider
        .otherwise({redirectTo: '/home'});

    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setRestangularFields({
        id: '_id'
    });
});

spatwork.controller("AppCtrl", function($rootScope){
    $rootScope.$on("$routeChangeError", function(){
        console.log("Failed to route!");
    })
});
