var rankCtrl = controllers.controller("RankCtrl", function($scope, rankingPoints, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
        for(var i=0;i<$scope.players.length;i++){
        	$scope.players[i].played = $scope.players[i].wins + $scope.players[i].draws + $scope.players[i].losses;
            $scope.players[i].points = rankingPoints.computePoints($scope.players[i]);
            $scope.players[i].gpm = $scope.players[i].played == 0 ? 0 : ($scope.players[i].goals / $scope.players[i].played);
        }
    }, function errorCallback() {
        alert("Oops unable to update server. Please refresh. :(");
    });
    $scope.predicate = ['-points', 'firstName'];

    $("[data-toggle='tooltip']").tooltip({placement: "top"});
});