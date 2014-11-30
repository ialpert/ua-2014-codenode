'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:codeEditor
 * @description
 * Directive for the code editor
 */

angular.module('interviewer')
  .directive('codeEditor', function(Languages, AppState, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'components/codeEditor/codeEditor.directive.html',
      link: function($scope) {
        var currentQuestionSync;


        var questionsSync, currentQuestionIdSync;

        $scope.modes = Languages;
        $scope.currentMode = 'javascript';
        $scope.code = '';

        questionsSync = AppState.getState().at('_page.session').at('questions');
        currentQuestionIdSync = AppState.getState().at('_page.session').at('currentQuestionSync');

        currentQuestionIdSync.on('change', '', function(val) {
          $scope.currentQuestionSync = val;
          $scope.code = questionsSync.at(val).get('editor.code');
          $scope.safeApply();
        });

        questionsSync.on('change', '**', function(path, value, oldValue, passed) {
          if (passed && !passed.local) {
            $timeout(function () {
              $scope.code = value;
            });
          }
        });

        //$scope.$watch('code', function () {
        //  //currentQuestionSync.at('editor.code').set($scope.code);
        //});

        //currentQuestionSync = AppState.getState().at('_page.session').at('currentQuestion');

        //currentQuestionSync.setNull();
        //$scope.aceLoaded = function(_editor) {
        //  editor = _editor;
        //};
        //
        $scope.aceChanged = function(e) {
          questionsSync.at($scope.currentQuestionSync).at('editor.code').set($scope.code);
        };
      }
    };
  });
