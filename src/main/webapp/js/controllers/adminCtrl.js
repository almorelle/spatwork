var adminCtrl = controllers.controller("AdminCtrl", function($scope, rankingService, balancingService, Restangular, user){

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
                $scope.game.teamA.totalrating = 0;
                $scope.game.teamB.totalgpm = 0;
                $scope.game.teamB.totalpts = 0;
                $scope.game.teamB.totalrating = 0;
                for(var i=0;i<$scope.players.length;i++){
                    var player = $scope.players[i];
                    if(_.contains($scope.game.teamA.teammateRefs, player._id)){
                        player.teamRef = "A";
                        $scope.game.teamA.totalgpm += player.gpm;
                        $scope.game.teamA.totalpts += player.points;
                        $scope.game.teamA.totalrating += player.rating;
                        player.scored = _.reduce($scope.game.teamA.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                        player.ownGoals = _.reduce($scope.game.teamB.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                    } else if (_.contains($scope.game.teamB.teammateRefs, player._id)){
                        player.teamRef = "B";
                        $scope.game.teamB.totalgpm += player.gpm;
                        $scope.game.teamB.totalpts += player.points;
                        $scope.game.teamB.totalrating += player.rating;
                        player.scored = _.reduce($scope.game.teamB.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                        player.ownGoals = _.reduce($scope.game.teamA.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                    } else {
                        player.teamRef = "N";
                    }
                }
                $scope.game.teamA.averagegpm = $scope.game.teamA.totalgpm / $scope.game.teamA.teammateRefs.length;
                $scope.game.teamA.averagepts = $scope.game.teamA.totalpts / $scope.game.teamA.teammateRefs.length;
                $scope.game.teamA.averagerating = $scope.game.teamA.totalrating / $scope.game.teamA.teammateRefs.length;
                $scope.game.teamB.averagegpm = $scope.game.teamB.totalgpm / $scope.game.teamB.teammateRefs.length;
                $scope.game.teamB.averagepts = $scope.game.teamB.totalpts / $scope.game.teamB.teammateRefs.length;
                $scope.game.teamB.averagerating = $scope.game.teamB.totalrating / $scope.game.teamB.teammateRefs.length;
            }, function errorCallback() {
                alert("Oops unable to get info from server. Please refresh. :(");
            });
        }, function errorCallback() {
            alert("Oops unable to get info from server. Please refresh. :(");
        });
    };

    $("[data-toggle='tooltip']").tooltip({placement: "top"});

    //Changes a player from one team to the other or add him.
    $scope.changeTeam = function(player){
        var team = {};
        var keyTeam = "";
        if(player.teamRef==="N"){
            team = ($scope.game.teamA.teammateRefs.length <= $scope.game.teamB.teammateRefs.length) ? $scope.game.teamA : $scope.game.teamB ;
            keyTeam = ($scope.game.teamA.teammateRefs.length <= $scope.game.teamB.teammateRefs.length) ? "A" : "B" ;
        } else {
            team = (player.teamRef==="A") ? $scope.game.teamB : $scope.game.teamA ;
            keyTeam = (player.teamRef==="A") ? "B" : "A" ;
        }
        $scope.game.customPUT({}, "join", {keyTeam: keyTeam, keyPlayer: player._id}).then(function(){
            team.teammateRefs.push(player._id);
            player.teamRef = keyTeam;
        }, function errorCallback() {
            alert("Oooops unable to update server. Please refresh. :(");
        });
    }

    //Reset the scoring parameters and open up the goal form.
    $scope.goal = function(player){
        $('#goalModal').modal('toggle');
    };

    //Saves the goal and update the game.
    $scope.saveGoal = function(player, team){
        $scope.game.customPUT({}, "goal", {token: user.token(), keyTeam: team, keyScorer: player._id}).then(function(){
            $scope.selectedPlayer={};
            $scope.oppositeTeamRef="";
            refreshScopeData();
        }), function errorCallback() {
            alert("Oops unable to update server. Please refresh. :(");
        };
        $('#goalModal').modal('toggle');
    };

    //Balance teams and reset.
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
        }else{
            alert("sorry can't update team once game started...");
        } 
    };

    //Ask for game end confirmation.
    $scope.confirmEnd = function(){
        $('#endModal').modal('toggle');
    };

    //Ends the game.
    $scope.end = function(){
        $scope.game.customPUT({}, "end", {token: user.token()}).then(function(){
            var newGame = {"teamA":{"teammateRefs":[],"score":0,"scorersRefs":[]},"teamB":{"teammateRefs":[],"score":0, "scorersRefs":[]}, "finished": false};
            Restangular.all("games").customPOST(newGame, "", {token: user.token()}).then(function(){
                $scope.game = newGame;
            }, function errorCallback() {
                alert("Oooops unable create new game on server. Please refresh. :(");
            });
            refreshScopeData();
        }, function errorCallback() {
            alert("Oops unable to update server. Please refresh. :(");
        });
        $('#endModal').modal('toggle');
    };
});
