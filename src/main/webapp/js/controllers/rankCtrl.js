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
});