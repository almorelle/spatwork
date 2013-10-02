var rankCtrl = controllers.controller("RankCtrl", function($scope, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
        for(var i=0;i<$scope.players.length;i++){
        	$scope.players[i].points = ($scope.players[i].wins*3) + $scope.players[i].draws;
        }
    }, function errorCallback() {
        alert("Oops unable to update server. Please refresh. :(");
    });
    $scope.predicate = ['-points', '-goals', 'firstName'];

    $("[data-toggle='tooltip']").tooltip({placement: "top"});
});