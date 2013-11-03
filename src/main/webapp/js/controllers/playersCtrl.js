var playersCtrl = controllers.controller("PlayersCtrl", function($scope, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
        Restangular.all("games").getList().then(function(games){
            $scope.game = _.findWhere(games,{finished: false});
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

    //init tooltips
    $('.tooltiped').tooltip({container: 'body'});

    //init collapsible elements
    $('#collapseOne').collapse({
      toggle: true,
      parent: "#accordion"
    })
    $('#collapseTwo').collapse({
      toggle: false,
      parent: "#accordion"
    })

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
            $('#collapseOne').collapse('toggle');
        }, function errorCallback() {
            alert("Oooops unable to update server. Please refresh. :(");
        });
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
            player.teamRef = "N";
            $('#collapseTwo').collapse('toggle')
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
            playerPostResponse.teamRef = "N";
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