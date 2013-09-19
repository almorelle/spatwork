'use strict';

/* Controllers */

var controllers = angular.module('spatwork.controllers', ['restangular']);
 
var viewCtrl = controllers.controller("ViewCtrl", function($scope, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
        Restangular.all("games").getList().then(function(games){
            $scope.game = games[0];
            for(var i=0;i<$scope.players.length;i++){
                var player = $scope.players[i];
                player.isPlaying = ((_.indexOf($scope.game.teamA.teammateRefs, player._id) !== -1) || (_.indexOf($scope.game.teamB.teammateRefs, player._id) !== -1));
            }
        });
    });

    $scope.play = function(player, play){
        player.isPlaying = play;
    }
});