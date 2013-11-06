var currentGameCtrl = controllers.controller("CurrentGameCtrl", function($scope, Restangular){

    $scope.teamEditing = false;
    refreshScopeData();

    function refreshScopeData(){
        Restangular.all("players").getList().then(function(players){
            $scope.players = players;
            Restangular.all("games").getList().then(function(games){
                $scope.game = _.findWhere(games,{finished: false});
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
            }, function errorCallback() {
                alert("Oops unable to get info from server. Please refresh. :(");
            });
        }, function errorCallback() {
            alert("Oops unable to get info from server. Please refresh. :(");
        });
    };

    //Changes a player from one team to the other or add him.
    $scope.join = function(player){
        $('#updateFade').modal('toggle');
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
        $('#updateFade').modal('toggle');
    }

    //Reset the scoring parameters and open up the goal form.
    $scope.goal = function(){
        $scope.keyTeam = "";
        $scope.scoringTeam = {};
        $('#goalModal').modal('toggle');
    };

    //Saves the goal and update the game.
    $scope.saveGoal = function(){
        $scope.game.customPUT({}, "goal", {keyTeam: $scope.scoringTeam, keyScorer: $scope.scorer._id}).then(function(){
            $scope.keyTeam = "";
            $scope.scoringTeam = {};
            refreshScopeData();
        }), function errorCallback() {
            alert("Oops unable to update server. Please refresh. :(");
        };
        $('#goalModal').modal('toggle');
    };

    //Close the game.
    $scope.end = function(){
        $scope.game.customPUT({}, "end", {}).then(function(){
            var newGame = {"teamA":{"teammateRefs":[],"score":0,"scorersRefs":[]},"teamB":{"teammateRefs":[],"score":0, "scorersRefs":[]}, "finished": false};
            Restangular.all("games").post(newGame).then(function(){
                $scope.game = newGame;
            }, function errorCallback() {
                alert("Oooops unable create new game on server. Please refresh. :(");
            });
            refreshScopeData();
        }, function errorCallback() {
            alert("Oops unable to update server. Please refresh. :(");
        });
    };

    //auto-affect scoring team depending on selected scorer when declaring a goal.
    $scope.scorerSelected = function() {
        $scope.scoringTeam = $scope.scorer.teamRef;
    };
});