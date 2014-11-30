'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:codeEditor
 * @description
 * Directive for the code editor
 */

angular.module('interviewer')
  .directive('codeEditor', function(Languages, AppState) {
    return {
      restrict: 'E',
      templateUrl: 'components/codeEditor/codeEditor.directive.html',
      link: function($scope) {
        var currentQuestionSync;


        var questionsSync, currentQuestionSync;

        $scope.modes = Languages;
        $scope.currentMode = 'javascript';
        $scope.code = '';

        questionsSync = AppState.getState().at('_page.session').at('questions');
        currentQuestionSync = AppState.getState().at('_page.session').at('currentQuestionSync');

        currentQuestionSync.on('change', '', function(val) {
          $scope.currentQuestionSync = val;

          console.log('CODE', questionsSync.at(val).get('editor.code'));
        });

        $scope.$watch('code', function () {
          //currentQuestionSync.at('editor.code').set($scope.code);
        });

        //currentQuestionSync = AppState.getState().at('_page.session').at('currentQuestion');

        //currentQuestionSync.setNull();
        //$scope.aceLoaded = function(_editor) {
        //  editor = _editor;
        //};
        //
        //$scope.aceChanged = function(e) {
        //  console.log(e);
        //};
      }
    };
  });
