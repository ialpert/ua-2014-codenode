'use strict';

/**
 * @ngdoc function
 * @name interviewer.controller:MainCtrl
 * @description
 * # MainCtrl
 * Whole page controller for the main application area.
 */
angular.module('interviewer')
  .controller('MainCtrl', function (toaster) {
    toaster.pop('success', 'Welcome to Interviewer!');
  });
