'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:codeEditor
 * @description
 * Directive for the code editor
 */

angular.module('interviewer')
  .directive('codeEditor', function(Languages) {
    return {
      restrict: 'E',
      templateUrl: 'components/codeEditor/codeEditor.directive.html',
      link: function($scope) {
        $scope.modes = Languages;
        $scope.currentMode = 'javascript';

        $scope.aceLoaded = function(/*_editor*/) {
          // Options
          //_editor.setReadOnly(true);
        };

        $scope.aceChanged = function(e) {
          console.log(e);
        };
      }
    };
  });
