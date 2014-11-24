'use strict';

/* Directives */
var directives = angular.module('spatworkDirectives', []);

directives.directive("rating", function() {

    var directive = { };
    directive.restrict = 'AE';

    directive.scope = {
        rate: '=rate',
        max: '=max'
    };

    directive.templateUrl = "partials/templates/rating.html";

    directive.link = function(scope, elements, attr) {
        scope.updateStars = function() {
            var idx = 0;
            scope.stars = [ ];
            for (idx = 0; idx < scope.max; idx += 1) {
                scope.stars.push({
                    full: scope.rate > idx
                });
            }
        };

        scope.starClass = function(star, idx) {
            var starClass = 'fa-star-o';
            if (star.full || idx <= scope.hoverIdx) {
                starClass = 'fa-star';
            }
            return starClass;
        };

        scope.$watch('rate', function(newValue, oldValue) {
            if (newValue !== null && newValue !== undefined) {
                scope.updateStars();
            }
        });

        scope.setRating = function(idx) {
            scope.rate = idx + 1;
        };

        scope.hover = function(idx) {
            scope.hoverIdx = idx;
        };

        scope.stopHover = function() {
            scope.hoverIdx = -1;
        };

        scope.starColor = function(idx) {
            var starClass = 'rating-normal';
            if (idx <= scope.hoverIdx) {
                starClass = 'rating-highlight';
            }
            return starClass;
        };
    };

    return directive;
});

directives.directive("teamrating", function() {

    var directive = { };
    directive.restrict = 'AE';

    directive.scope = {
        teamrate: '=teamrate',
        max: '=max'
    };

    directive.templateUrl = "partials/templates/teamrating.html";

    directive.link = function(scope, elements, attr) {
        scope.updateStars = function() {
            var idx = 0;
            scope.stars = [ ];
            for (idx = 0; idx < scope.max; idx += 1) {
                scope.stars.push({
                    full: parseInt(scope.teamrate) > idx,
                    half: parseInt(scope.teamrate*10) >= (idx*10+scope.max)
                });
            }
        };

        scope.starClass = function(star, idx) {
            var starClass = 'fa-star-o';
            if (star.full) {
                starClass = 'fa-star';
            } else if (star.half){
                starClass = 'fa-star-half-o';
            }
            return starClass;
        };

        scope.$watch('teamrate', function(newValue, oldValue) {
            if (newValue !== null && newValue !== undefined) {
                scope.updateStars();
            }
        });
    };

    return directive;
});