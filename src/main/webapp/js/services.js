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

// Balance the teams.
services.service('balancingService', function() {
    this.balance = function(game, players, sortField) {
            //filtering players playing and sorting them using sortField argument
            players = _.filter(players, function(player){
                return _.indexOf(game.teamA.teammateRefs, player._id) != -1 ||
                    _.indexOf(game.teamB.teammateRefs, player._id) != -1;
            });
            players = _.sortBy(players, sortField);

            //balancing teams
            var pointsA = 0;
            var pointsB = 0;
            game.teamA.teammateRefs = [];
            game.teamB.teammateRefs = [];
            for(var i=0;i<players.length;i+=2){
                if(i+1 >= players.length){
                    var heaviestOfAll = players[i]._id;
                    if(pointsA <= pointsB){
                        game.teamA.teammateRefs.push(heaviestOfAll);
                        pointsA += heaviestOfAll.points;
                    } else {
                        game.teamB.teammateRefs.push(heaviestOfAll);
                        pointsB += heaviestOfAll.points;
                    }
                } else {
                    var heaviest = players[i]._id;
                    var lightest = players[i+1]._id;
                    if(pointsA <= pointsB){
                        game.teamA.teammateRefs.push(heaviest);
                        game.teamB.teammateRefs.push(lightest);
                        pointsA += heaviest.points;
                        pointsB += lightest.points;
                    } else {
                        game.teamA.teammateRefs.push(lightest);
                        game.teamB.teammateRefs.push(heaviest);
                        pointsA += lightest.points;
                        pointsB += heaviest.points;
                    }
                }
            }
        return game;
    };
});