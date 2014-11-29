'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:questions
 * @description
 * Directive for the question list.
 */
angular.module('interviewer')
  .directive('questions', function($mdDialog, AppState, lodash, Room) {
    return {
      restrict: 'E',
      templateUrl: 'components/questions/questions.directive.html',
      link: function($scope) {

      }
    };
  });

