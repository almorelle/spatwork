'use strict';

// Declare app level module which depends on filters, and services
var spatwork = angular.module('spatwork', ['ngRoute', 'spatworkControllers', 'spatworkFilters', 'spatworkServices', 'UserApp']);

//App controllers
var controllers = angular.module('spatworkControllers', ['restangular']);

spatwork.config(function($routeProvider, RestangularProvider) {

    $routeProvider
        .when('/players',
        {
            templateUrl: 'partials/players.html',
            controller: 'PlayerCtrl',
            public: true
        });

    $routeProvider
        .when('/teams', {
            templateUrl: 'partials/teams.html',
            controller: 'TeamCtrl',
            public: true
    });

    $routeProvider
        .when('/ranking', {
            templateUrl: 'partials/ranking.html',
            controller: 'RankCtrl',
            public: true
    });

    $routeProvider
        .when('/games', {
            templateUrl: 'partials/games.html',
            controller: 'GameCtrl',
            public: true
    });

    $routeProvider
        .when('/admingame', {
            templateUrl: 'partials/admin.html',
            controller: 'AdminCtrl',
            hasPermission: 'admin'
    });

    $routeProvider
        .when('/login', {
            templateUrl: 'partials/login.html',
            login: true
    });

    $routeProvider
        .otherwise({redirectTo: '/players'});

    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setRestangularFields({
        id: '_id'
    });
});

spatwork.run(function(user) {
    user.init({ appId: '53aad3e4212d8', heartbeatInterval: 0 });
});

spatwork.controller("AppCtrl", function($rootScope){
    $rootScope.$on("$routeChangeError", function(){
        console.log("Failed to route!");
    })
});
