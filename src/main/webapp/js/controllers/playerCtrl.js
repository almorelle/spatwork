var playerCtrl = controllers.controller("PlayerCtrl", function($scope, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
        Restangular.all("games").getList().then(function(games){
            $scope.game = games[0];
            for(var i=0;i<$scope.players.length;i++){
                var player = $scope.players[i];
                player.isPlaying = ((_.indexOf($scope.game.teamA.teammateRefs, player._id) !== -1) ||
                                    (_.indexOf($scope.game.teamB.teammateRefs, player._id) !== -1));
            }
        }, function errorCallback() {
            alert("Oops unable to get info from server. Please refresh. :(");
        });
    }, function errorCallback() {
        alert("Oops unable to get info from server. Please refresh. :(");
    });

    $scope.join = function(player){
        $('#updateFade').modal('toggle');
        $scope.game.customPUT({}, "join", {keyTeam: "A", keyPlayer: player._id}).then(function(){
            $scope.game.teamA.teammateRefs.push(player._id);
            player.isPlaying = true;
        }), function errorCallback() {
            alert("Oooops unable to update server. Please refresh. :(");
        };
        $('#updateFade').modal('toggle');
    }

    $scope.leave = function(player){
        $('#updateFade').modal('toggle');
        $scope.game.customPUT({}, "leave", {keyPlayer: player._id}).then(function(){
            var i = $scope.game.teamA.teammateRefs.indexOf(player._id);
            if($scope.game.teamA.teammateRefs.indexOf(player._id) != -1) {
                $scope.game.teamA.teammateRefs.splice(i, 1);
            }
            i = $scope.game.teamB.teammateRefs.indexOf(player._id);
            if ($scope.game.teamB.teammateRefs.indexOf(player._id) != -1) {
                $scope.game.teamB.teammateRefs.splice(i, 1);
            }
            player.isPlaying = false;
        }, function errorCallback() {
            alert("Oooops unable to update server. Please refresh. :(");
         });
         $('#updateFade').modal('toggle');
    }

    $scope.createPlayer = function(){
        var newPlayer = {firstName: $scope.newFirstName, lastName: $scope.newLastName, goals: 0, wins: 0, losses: 0, subscription: false, certificate: false};
        $scope.players.post(newPlayer).then(function(playerPostResponse) {
            $scope.newFirstName="";
            $scope.newLastName="";
            playerPostResponse.isPlaying = false;
            $scope.players.push(playerPostResponse);
        }, function errorCallback(){
            $scope.newFirstName="";
            $scope.newLastName="";
            alert("Oooops unable to create from server. Please refresh. :(");
        });
        $('#addPlayerModal').modal('toggle');
    }

    $scope.destroyPlayer = function(player){
        player.remove().then(function() {
            $scope.players = _.without($scope.players, player);
        }, function errorCallback(){
            alert("Oooops unable to delete from server. Please refresh. :(");
        });
    }
});