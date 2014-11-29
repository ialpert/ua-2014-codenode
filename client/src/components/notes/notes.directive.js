
'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:notes
 * @description
 */

angular.module('interviewer')
  .directive('notes', function(AppState, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'components/notes/notes.html',
      scope: {},
      link: function(scope) {

      }
    };
  });
