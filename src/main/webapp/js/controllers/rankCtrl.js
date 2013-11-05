var rankCtrl = controllers.controller("RankCtrl", function($scope, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
        for(var i=0;i<$scope.players.length;i++){
        	$scope.players[i].played = $scope.players[i].wins + $scope.players[i].draws + $scope.players[i].losses;
        	$scope.players[i].points = $scope.players[i].played == 0 ? 0 :
        	    (($scope.players[i].wins*3) + $scope.players[i].draws) + ($scope.players[i].goals / $scope.players[i].played);
        }
    }, function errorCallback() {
        alert("Oops unable to update server. Please refresh. :(");
    });
    $scope.predicate = ['-points', 'firstName'];

    $("[data-toggle='tooltip']").tooltip({placement: "top"});
});