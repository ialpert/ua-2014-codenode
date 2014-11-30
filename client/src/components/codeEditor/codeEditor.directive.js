'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:codeEditor
 * @description
 * Directive for the code editor
 */

angular.module('interviewer')
  .directive('codeEditor', function(Languages, AppState, $timeout, Session) {
    return {
      restrict: 'E',
      templateUrl: 'components/codeEditor/codeEditor.directive.html',
      link: function($scope) {
        var questionsSync, currentQuestionIdSync;

        $scope.modes = Languages;
        $scope.currentMode = 'javascript';
        $scope.code = '';

        questionsSync = AppState.getState().at('_page.session').at('questions');
        currentQuestionIdSync = AppState.getState().at('_page.session').at('currentQuestionSync');

        function setCode(val) {
          $scope.currentQuestionSync = val;
          $scope.code = questionsSync.at(val).get('editor.code');
          $scope.safeApply();
        }

        currentQuestionIdSync.on('change', '', setCode);

        setCode(currentQuestionIdSync.get());

        questionsSync.on('change', '**', function(path, value, oldValue, passed) {
          if (passed && !passed.local && angular.isString(value)) {
            $timeout(function() {
              $scope.code = value;
            });
          }
        });

        $scope.aceChanged = function(e) {
          questionsSync.at($scope.currentQuestionSync).at('editor.code').set($scope.code);
        };

        AppState.getState().at('_page.session').at('editor.executionResult').on('change', '', function(path, val) {

          $timeout(function() {

            if (val.error) {
              $scope.error = val.error;
              $scope.executionResult = null;
            } else {
              $scope.error = null;
              $scope.executionResult = val.result;
            }

          });
        });

        /**
         * Execute code on the server
         * @param code
         */
        $scope.execute = function(code) {
          Session.execute({
            code: code
          })
            .then(function(response) {
              /*              $scope.error = null;
               $scope.executionResult = response.log;*/
              AppState.getState().at('_page.session').at('editor').set('executionResult', {
                result: response.log,
                error: null
              });

            })
            .catch(function(error) {
              /*              $scope.error = error.message;
               $scope.executionResult = null;*/
              AppState.getState().at('_page.session').at('editor').set('executionResult', {
                error: error.message,
                result: null
              });
            });
        };
      }
    };
  });
