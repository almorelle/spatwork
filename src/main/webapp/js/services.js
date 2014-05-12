'use strict';

/* Services */
var services = angular.module('spatworkServices', []);

// Ranking points computing service.
// Current formula is Points = ( 3 x V + N ) + ( Goals x 0,05 ).
services.service('rankingService', function() {
    this.points = function(player) {
        return ((player.wins*3) + player.draws) + (player.goals * 5e-2);
    };

    this.goalsPerMatch = function(player) {
        return (player.played == 0) ? 0 : (player.goals / player.played);
    };
});

// Retrieves the videos data.
services.service('videoService', function($http, $cacheFactory) {
    this.getData = function() {
        return $http.get('videos/videos.json').then(function(result) {
            $cacheFactory.get('$http').remove('videos/videos.json');
            return result.data;
        });
    };
});