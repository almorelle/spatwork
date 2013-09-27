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
        $('#updateFade').modal('toggle');
        $scope.game.customPUT({}, "goal", {keyTeam: keyTeam, keyScorer: scorer._id}).then(function(){
            $('#updateFade').modal('toggle');
        }), function errorCallback() {
            $('#updateFade').modal('toggle');
            alert("Oops unable to update server. Please refresh. :(");
        };
    };

    $scope.end = function(){
        $('#updateFade').modal('toggle');
        $scope.game.customPUT({}, "end", {}).then(function(){
            $('#updateFade').modal('toggle');
        }, function errorCallback() {
            $('#updateFade').modal('toggle');
            alert("Oops unable to update server. Please refresh. :(");
         });
    };
});