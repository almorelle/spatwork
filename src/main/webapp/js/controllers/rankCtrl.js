var rankCtrl = controllers.controller("RankCtrl", function($scope, rankingService, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
        for(var i=0;i<$scope.players.length;i++){
        	$scope.players[i].played = $scope.players[i].wins + $scope.players[i].draws + $scope.players[i].losses;
            $scope.players[i].points = rankingService.points($scope.players[i]);
            $scope.players[i].gpm = rankingService.goalsPerMatch($scope.players[i]);
        }
    }, function errorCallback() {
        alert("Oops unable to update server. Please refresh. :(");
    });

    $scope.predicate = ['-points', 'firstName'];

    $("[data-toggle='tooltip']").tooltip({placement: "top"});

    $scope.destroyPlayer = function(player){
        player.remove().then(function() {
            $scope.players = _.without($scope.players, player);
        }, function errorCallback(){
            alert("Oooops unable to delete from server. Please refresh. :(");
        });
    }

    $scope.editPlayer = function(player){
        $scope.editedPlayer = Restangular.copy(player);
        $('#editPlayerModal').modal('toggle');
    }

    $scope.updatePlayer = function(){
        $scope.editedPlayer.put().then(function() {
            $scope.players[_.indexOf($scope.players, _.findWhere($scope.players, {_id: $scope.editedPlayer._id}))] = $scope.editedPlayer;
            $scope.editedPlayer = {};
        }, function errorCallback(){
            $scope.editedPlayer = {};
            alert("Oooops unable to update from server. Please refresh. :(");
        });
        $('#editPlayerModal').modal('toggle');
    }
});