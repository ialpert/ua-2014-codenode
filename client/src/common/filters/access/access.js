'use strict';

angular.module('interviewer')
  .filter('access', function(Room, lodash) {
    var me = Room.me;

    return function(items) {

      return lodash.filter(items, function(item) {
        if (item.access) {
          return lodash.contains(item.access, me.status);
        } else {
          return true;
        }
      });
    };
  });
