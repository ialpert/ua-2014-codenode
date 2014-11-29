angular.module('racer', [], ['$provide', function($provide) {
  "use strict";

  $provide.factory('racer', function() {
    return require('racer');
  });
}]);
