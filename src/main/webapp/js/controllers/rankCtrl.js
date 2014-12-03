var rankCtrl = controllers.controller("RankCtrl", function($scope, rankingService, Restangular){
    Restangular.all("players").getList().then(function(players){
        $scope.players = players;
        $scope.scatterChartSeries = [];
        for(var i=0;i<$scope.players.length;i++){
        	$scope.players[i].played = $scope.players[i].wins + $scope.players[i].draws + $scope.players[i].losses;
            $scope.players[i].points = rankingService.points($scope.players[i]);
            $scope.players[i].gpm = rankingService.goalsPerMatch($scope.players[i]);
            if($scope.players[i].draws == $scope.players[i].played) {
                $scope.players[i].statWin = 0;
                $scope.players[i].statLoss = 0;
            } else {
                $scope.players[i].statWin = Math.round((($scope.players[i].wins * 5 ) / ($scope.players[i].wins + $scope.players[i].losses) ) * 10) / 10;
                $scope.players[i].statLoss = Math.round((($scope.players[i].losses * 5 ) / ($scope.players[i].wins + $scope.players[i].losses) ) * 10) / 10;
            }
            $scope.scatterChartSeries.push({
                id: $scope.players[i]._id,
                name: $scope.players[i].firstName,
                marker: {symbol: 'circle'},
                color: 'rgba(119, 152, 191, .5)',
                data: [[
                    $scope.players[i].played,
                    $scope.players[i].goals,
                    $scope.players[i].points
                ]]
            });
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

    $scope.displayStats = function(player){
        $scope.playerStats = player;

        $scope.playsChartConfig.series = [{
                type: 'pie',
                name: player.firstName+' '+player.lastName,
                innerSize: '50%',
                 data: [
                    ['Victoires', player.wins],
                    ['Défaites', player.losses],
                    ['Nuls', player.draws]
                ]
             }];

        $scope.goalsChartConfig.series = _.map($scope.scatterChartSeries,
            function(p) {
                if(p.id == player._id) p.color='rgba(223, 83, 83, 1)';
                else p.color='rgba(119, 152, 191, .5)';
                return p;
            }
        );

        $('#displayStatsModal').modal('toggle');
    }

    $scope.playsChartConfig = {
         //This is not a highcharts object. It just looks a little like one!
         options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be ovverriden by values specified below.
            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                margin: [-80, 0, -100, 0],
                spacing: [15, 10, 10, 10],
                height: 200
            },
            title: {
                text: 'Matches joués',
                align: 'center',
                verticalAlign: 'middle',
                y: 80
            },
             tooltip: {
                 pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
             },
            plotOptions: {
                pie: {
                    slicedOffset: 0,
                    size: '100%',
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            }
         },

         //The below properties are watched separately for changes.

         //Series object (optional) - a list of series using normal highcharts series options.
         series: []
    };

    $scope.goalsChartConfig = {
         //This is not a highcharts object. It just looks a little like one!
         options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be ovverriden by values specified below.
            chart: {
                type: 'bubble',
                zoomType: 'xy',
                spacing: [50, 10, 10, 10],
            },
            title: {
                text: 'Nombre de buts par matches joués'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'Matches joués'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,
                min: 0
            },
            yAxis: {
                title: {
                    text: 'Buts'
                },
                min: 0
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                bubble: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.y} buts en {point.x} matchs et {point.z} points'
                    }
                }
            }
         },

         //The below properties are watched separately for changes.

         //Series object (optional) - a list of series using normal highcharts series options.

        series: []
    };

    $('#displayStatsModal').on('shown.bs.modal', function() {
        $('#playsChart').highcharts().reflow();
        $('#goalsChart').highcharts().reflow();
    });
});