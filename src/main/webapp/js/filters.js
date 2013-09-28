'use strict';

/* Filters */
var filters = angular.module('spatworkFilters', []);

filters.filter('checkmark', function() {
    return function(input) {
        return input ? 'icon-ok' : 'icon-remove';
    };
});
