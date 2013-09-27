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
});