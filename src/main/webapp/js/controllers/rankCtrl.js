var rankCtrl = controllers.controller("RankCtrl", function($scope, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
    }, function errorCallback() {
        alert("Oops unable to update server. Please refresh. :(");
    });
    $scope.predicate = ['-wins', '-goals', 'firstName'];

    $("[data-toggle='tooltip']").tooltip({placement: "top"});
});