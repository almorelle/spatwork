'use strict';

/* Services */
var services = angular.module('spatworkServices', []);

// Ranking points computing service.
// Current formula is Points = ( 3 x V + N ) + ( Goals x 0,05 ).
services.service('rankingPoints', function() {
    this.computePoints = function(player) {
        return ((player.wins*3) + player.draws) + (player.goals * 5e-2);
    };
});