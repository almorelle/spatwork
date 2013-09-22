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
                player.isPlaying = ((_.indexOf($scope.game.teamA.teammateRefs, player._id) !== -1) ||
                                    (_.indexOf($scope.game.teamB.teammateRefs, player._id) !== -1));
            }
        }, function errorCallback() {
            alert("Oops unable to get info from server. Please refresh. :(");
        });
    }, function errorCallback() {
        alert("Oops unable to get info from server. Please refresh. :(");
    });

    $scope.join = function(player){
        $('#updateModal').modal('toggle')
        $scope.game.customPUT({}, "join", {keyTeam: "A", keyPlayer: player._id}).then(function(){
            $scope.game.teamA.teammateRefs.push(player._id);
            player.isPlaying = true;
            $('#updateModal').modal('toggle');
        }), function errorCallback() {
            $('#updateModal').modal('toggle');
            alert("Oops unable to update server. Please refresh. :(");
        };
    }

    $scope.leave = function(player){
        $('#updateModal').modal('toggle')
        $scope.game.customPUT({}, "leave", {keyPlayer: player._id}).then(function(){
            var i = $scope.game.teamA.teammateRefs.indexOf(player._id);
            if($scope.game.teamA.teammateRefs.indexOf(player._id) != -1) {
                $scope.game.teamA.teammateRefs.splice(i, 1);
            }
            i = $scope.game.teamB.teammateRefs.indexOf(player._id);
            if ($scope.game.teamB.teammateRefs.indexOf(player._id) != -1) {
                $scope.game.teamB.teammateRefs.splice(i, 1);
            }
            player.isPlaying = false;
            $('#updateModal').modal('toggle');
        }, function errorCallback() {
            $('#updateModal').modal('toggle');
            alert("Oops unable to update server. Please refresh. :(");
         });
    }
});

var rankCtrl = controllers.controller("RankCtrl", function($scope, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
    }, function errorCallback() {
        alert("Oops unable to update server. Please refresh. :(");
    });
    $scope.predicate = ['-wins', '-goals'];
});



var gameCtrl = controllers.controller("GameCtrl", function($scope, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
        Restangular.all("games").getList().then(function(games){
            $scope.game = games[0];
            for(var i=0;i<$scope.players.length;i++){
                var player = $scope.players[i];
                player.isPlaying = ((_.indexOf($scope.game.teamA.teammateRefs, player._id) !== -1) ||
                                    (_.indexOf($scope.game.teamB.teammateRefs, player._id) !== -1));
            }
        }, function errorCallback() {
            alert("Oops unable to get info from server. Please refresh. :(");
        });
    }, function errorCallback() {
        alert("Oops unable to get info from server. Please refresh. :(");
    });

    $scope.goal = function(){

        var keyTeam;
        var scorer;

        $('#updateModal').modal('toggle')
        $scope.game.customPUT({}, "goal", {keyTeam: keyTeam, keyScorer: scorer._id}).then(function(){
            $('#updateModal').modal('toggle');
        }), function errorCallback() {
            $('#updateModal').modal('toggle');
            alert("Oops unable to update server. Please refresh. :(");
        };
    };

    $scope.end = function(){
        $('#updateModal').modal('toggle')
        $scope.game.customPUT({}, "end", {}).then(function(){
            $('#updateModal').modal('toggle');
        }, function errorCallback() {
            $('#updateModal').modal('toggle');
            alert("Oops unable to update server. Please refresh. :(");
         });
    };
});