'use strict';

// Declare app level module which depends on filters, and services
var spatwork = angular.module('spatwork', ['ngRoute', 'spatworkControllers', 'spatworkFilters', 'spatworkServices', 'spatworkDirectives', 'UserApp', 'highcharts-ng']);

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
            controller: 'AdminCtrl',
            public: true
    });

    $routeProvider
        .when('/ranking', {
            templateUrl: 'partials/ranking.html',
            controller: 'RankCtrl',
            public: true
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

spatwork.run(function(user, $location) {
    user.init({ appId: '53aad3e4212d8', heartbeatInterval: 0 });
    user.onAuthenticationSuccess(function() {
        $location.path( "/teams" );
    });
});

spatwork.controller("AppCtrl", function($rootScope){
    $rootScope.$on("$routeChangeError", function(){
        console.log("Failed to route!");
    })
});
