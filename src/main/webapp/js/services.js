'use strict';

/* Services */
var services = angular.module('spatworkServices', []);

// Ranking points computing service.
// Current formula is Points = ( ( 3 x V + N ) / Matchs ) + ( Goals / Matchs ) or 0 if never played.
services.service('rankingPoints', function() {
    this.computePoints = function(player) {
        return player.played == 0 ? 0 : (((player.wins*3) + player.draws) / player.played) + (player.goals / player.played);
    };
});