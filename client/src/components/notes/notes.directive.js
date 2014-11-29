
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
        var notesSync = AppState.getState().at('_page.user').at('notes');

        scope.text = notesSync.get();

        notesSync.on('change', function(value, previous, passed) {
          if (passed.local) {
            return;
          }

          $timeout(function() {
            scope.text = notesSync.get();
          });
        });

        scope.update = function(value) {
          notesSync.pass({local: true}).set(value);
        };
      }
    };
  });
