'use strict';

// Declare app level module which depends on filters, and services
var spatwork = angular.module('spatwork', ['ngRoute', 'spatworkControllers', 'spatworkFilters', 'spatworkServices']);

//App controllers
var controllers = angular.module('spatworkControllers', ['restangular']);

spatwork.config(function($routeProvider, RestangularProvider) {

    $routeProvider
        .when('/players',
        {
            templateUrl: 'partials/players.html',
            controller: 'PlayerCtrl'
        });

    $routeProvider
        .when('/teams', {
            templateUrl: 'partials/teams.html',
            controller: 'TeamCtrl'
    });

    $routeProvider
        .when('/ranking', {
            templateUrl: 'partials/ranking.html',
            controller: 'RankCtrl'
    });

    $routeProvider
        .when('/games', {
            templateUrl: 'partials/games.html',
            controller: 'GameCtrl'
    });

    $routeProvider
        .when('/admingame', {
            templateUrl: 'partials/admin.html',
            controller: 'AdminCtrl'
    });

    $routeProvider
        .otherwise({redirectTo: '/players'});

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
