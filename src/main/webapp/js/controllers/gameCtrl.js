var gameCtrl = controllers.controller("GameCtrl", function($scope, Restangular){
    $scope._ = _;
    refreshScopeData();
    $scope.goal = function(){
        $scope.keyTeam = "";
        $scope.scoringTeam = {};
        $('#goalModal').modal('toggle');
    };

    function refreshScopeData(){
        Restangular.all("players").getList().then(function(players){
            $scope.players = players;
            Restangular.all("games").getList().then(function(games){
                $scope.game = _.last(games);
                for(var i=0;i<$scope.players.length;i++){
                    var player = $scope.players[i];
                    player.teamRef = (_.contains($scope.game.teamA.teammateRefs, player._id)) ?
                                     "A" : (_.contains($scope.game.teamB.teammateRefs, player._id)) ?
                                     "B" : "N";
                }
            }, function errorCallback() {
                alert("Oops unable to get info from server. Please refresh. :(");
            });
        }, function errorCallback() {
            alert("Oops unable to get info from server. Please refresh. :(");
        });
    };

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

    $scope.isPlaying = function(player) {
        return (player.teamRef==="A" || player.teamRef==="B");
    };

    $scope.scorerSelected = function() {
        $scope.scoringTeam = $scope.scorer.teamRef;
    };

    $scope.hasScoredMoreThanOnce = function(team, player) {
        player.scoredInGame = _.reduce(team.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
        return  player.scoredInGame > 1;
    };
});