'use strict';

/**
 * @ngdoc function
 * @name room
 * @description
 * # room
 * Stores the room options
 */
angular.module('interviewer')
  .value('Room', {
    interview: null,
    token: null,
    me: null
  });
