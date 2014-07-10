var teamCtrl = controllers.controller("TeamCtrl", function($scope, rankingService, balancingService, Restangular, user){

    refreshScopeData();

    function refreshScopeData(){
        Restangular.all("players").getList().then(function(players){
            $scope.players = players;
            for(var i=0;i<$scope.players.length;i++){
                $scope.players[i].played = $scope.players[i].wins + $scope.players[i].draws + $scope.players[i].losses;
                $scope.players[i].points = rankingService.points($scope.players[i]);
                $scope.players[i].gpm = rankingService.goalsPerMatch($scope.players[i]);
            }
            Restangular.all("games").getList().then(function(games){
                $scope.game = _.findWhere(games,{finished: false});
                $scope.game.teamA.totalgpm = 0;
                $scope.game.teamA.totalpts = 0;
                $scope.game.teamB.totalgpm = 0;
                $scope.game.teamB.totalpts = 0;
                for(var i=0;i<$scope.players.length;i++){
                    var player = $scope.players[i];
                    if(_.contains($scope.game.teamA.teammateRefs, player._id)){
                        player.teamRef = "A";
                        $scope.game.teamA.totalgpm += player.gpm;
                        $scope.game.teamA.totalpts += player.points;
                        player.scored = _.reduce($scope.game.teamA.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                        player.ownGoals = _.reduce($scope.game.teamB.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                    } else if (_.contains($scope.game.teamB.teammateRefs, player._id)){
                        player.teamRef = "B";
                        $scope.game.teamB.totalgpm += player.gpm;
                        $scope.game.teamB.totalpts += player.points;
                        player.scored = _.reduce($scope.game.teamB.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                        player.ownGoals = _.reduce($scope.game.teamA.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                    } else {
                        player.teamRef = "N";
                    }
                }
                $scope.game.teamA.averagegpm = $scope.game.teamA.totalgpm / $scope.game.teamA.teammateRefs.length;
                $scope.game.teamA.averagepts = $scope.game.teamA.totalpts / $scope.game.teamA.teammateRefs.length;
                $scope.game.teamB.averagegpm = $scope.game.teamB.totalgpm / $scope.game.teamB.teammateRefs.length;
                $scope.game.teamB.averagepts = $scope.game.teamB.totalpts / $scope.game.teamB.teammateRefs.length;
            }, function errorCallback() {
                alert("Oops unable to get info from server. Please refresh. :(");
            });
        }, function errorCallback() {
            alert("Oops unable to get info from server. Please refresh. :(");
        });
    };

    $("[data-toggle='tooltip']").tooltip({placement: "top"});

    //Reset the scoring parameters and open up the goal form.
    $scope.balanceTeams = function(sortField){
        //balance teams only if the game has not started yet
        if($scope.game.teamA.score == 0 && $scope.game.teamB.score == 0){
            $('#updateFade').modal('toggle');
            var editGame = balancingService.balance(Restangular.copy($scope.game), $scope.players, sortField);
            editGame.customPUT(editGame, "", {token: user.token()}).then(function(){
                $scope.keyTeam = "";
                $scope.scoringTeam = {};
                refreshScopeData();
            }), function errorCallback() {
                alert("Oops unable to update server. Please refresh. :(");
            };
            $('#updateFade').modal('toggle');
        }//TODO else alert "sorry can't update team once game started..."
    };
});