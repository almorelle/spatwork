var gameCtrl = controllers.controller("GameCtrl", function($scope, rankingService, videoService, Restangular){

    refreshScopeData();

    function refreshScopeData(){
        Restangular.all("players").getList().then(function(players){
            $scope.players = players;
            Restangular.all("games").getList().then(function(games){
                $scope.games = _.filter(games,{finished: true});
                //Sorting the collection by timestamps while attaching a timestamp attribute to each element.
                _.sortBy($scope.games, function(game) { return game.timestamp = parseInt(game._id.toString().substring(0,8), 16 ) * 1000; });
                //Providing then an index attribute for quicker access.
                for(var i=0;i<$scope.games.length;i++){
                    $scope.games[i].index = i;
                }
                //Load video urls to game objects
                videoService.getData().then(function(data){
                    $scope.videos = data;
                });
                //Select the latest element.
                $scope.setGame($scope.games.length-1);
            }, function errorCallback() {
                alert("Oops unable to get info from server. Please refresh. :(");
            });
        }, function errorCallback() {
            alert("Oops unable to get info from server. Please refresh. :(");
        });
    };

    $("[data-toggle='tooltip']").tooltip({placement: "top"});

    //Adds as attribute of each player a team reference and the number of scored goals and own goals depending on the current game.
    function attributeTeamAndGoals(){
        for(var i=0;i<$scope.players.length;i++){
            var player = $scope.players[i];
            player.played = player.wins + player.draws + player.losses;
            player.points = rankingService.points(player);
            player.gpm = rankingService.goalsPerMatch(player);
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
    }

    //Updates the current game object to the one at the index in parameter.
    $scope.setGame = function (index){
        if( ($scope.selectedGame != index) && (index >= 0) && (index < $scope.games.length) ){
            $scope.game = $scope.games[index];
            $scope.selectedGame = index;
            $scope.game.teamA.totalgpm = 0;
            $scope.game.teamA.totalpts = 0;
            $scope.game.teamA.totalrating = 0;
            $scope.game.teamB.totalgpm = 0;
            $scope.game.teamB.totalpts = 0;
            $scope.game.teamB.totalrating = 0;
            attributeTeamAndGoals();
            $scope.game.teamA.averagegpm = $scope.game.teamA.totalgpm / $scope.game.teamA.teammateRefs.length;
            $scope.game.teamA.averagepts = $scope.game.teamA.totalpts / $scope.game.teamA.teammateRefs.length;
            $scope.game.teamA.averagerating = $scope.game.teamA.totalrating / $scope.game.teamA.teammateRefs.length;
            $scope.game.teamB.averagegpm = $scope.game.teamB.totalgpm / $scope.game.teamB.teammateRefs.length;
            $scope.game.teamB.averagepts = $scope.game.teamB.totalpts / $scope.game.teamB.teammateRefs.length;
            $scope.game.teamB.averagerating = $scope.game.teamB.totalrating / $scope.game.teamB.teammateRefs.length;
            $scope.pageStart = getPaginationStart($scope.selectedGame, $scope.games.length);
            var video = _.find($scope.videos, function(vid){return vid.id == index+1});
            $scope.game.hasVideo = (video !== undefined);
            if($scope.game.hasVideo){
                $scope.game.videoUrl = video.file;
                $scope.game.videoStream = video.web;
            }
        }
    }

    //Returns the index at which the pagination should start.
    function getPaginationStart(currentIndex, length){
        var startPageIndex =  currentIndex - 2;
        if(currentIndex < 3) {
            startPageIndex = 0;
        } else if(currentIndex > (length - 3)){
            startPageIndex = length - 5;
        }
        return startPageIndex;
    }
});