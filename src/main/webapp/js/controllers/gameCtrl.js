var gameCtrl = controllers.controller("GameCtrl", function($scope, Restangular){

    refreshScopeData();

    function refreshScopeData(){
        Restangular.all("players").getList().then(function(players){
            $scope.players = players;
            Restangular.all("games").getList().then(function(games){
                $scope.games = _.where(games,{finished: true});
                for(var i=0;i<$scope.games.length;i++){
                    $scope.games[i].timestamp = $scope.games[i]._id.toString().substring(0,8);
                    //$scope.games[i].date = new Date( parseInt( $scope.games[i].timestamp, 16 ) * 1000 );
                }
                $scope.game = _.max($scope.games, function(game){ return game.timestamp; });
                $scope.selectedGame = $scope.games.length - 1;
                attributeTeamAndGoals();
            }, function errorCallback() {
                alert("Oops unable to get info from server. Please refresh. :(");
            });
        }, function errorCallback() {
            alert("Oops unable to get info from server. Please refresh. :(");
        });
    };

    function attributeTeamAndGoals(){
        for(var i=0;i<$scope.players.length;i++){
            var player = $scope.players[i];
            if(_.contains($scope.game.teamA.teammateRefs, player._id)){
                player.teamRef = "A";
                player.scored = _.reduce($scope.game.teamA.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                player.ownGoals = _.reduce($scope.game.teamB.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
            } else if (_.contains($scope.game.teamB.teammateRefs, player._id)){
                player.teamRef = "B";
                player.scored = _.reduce($scope.game.teamB.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                player.ownGoals = _.reduce($scope.game.teamA.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
            } else {
                player.teamRef = "N";
            }
        }
    }

    $scope.isPlaying = function(player) {
        return (player.teamRef==="A" || player.teamRef==="B");
    };

    $scope.setGame = function (index){
        if( ($scope.selectedGame != index) && (index >= 0) && (index < $scope.games.length) ){
            $scope.game = $scope.games[index];
            $scope.selectedGame = index;
            attributeTeamAndGoals();
        }
    }
});