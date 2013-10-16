'use strict';

/* Filters */
var filters = angular.module('spatworkFilters', []);

filters.filter('checkmark', function() {
    return function(input) {
        return input ? 'icon-ok' : 'icon-remove';
    };
});

filters.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return _.rest(input,start);
    }
});
