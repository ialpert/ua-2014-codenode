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
      scope: {},
      link: function($scope) {
        /**
         * @describe
         * Current selected question.
         * @type {Object}
         */
        $scope.currentQuestion = null;

        /**
         * List of question states.
         * @type {{label: string}[]}
         */
        $scope.states = {
          'success': 'success',
          'so-so'  : 'warning',
          'oops...': 'danger'
        };

        $scope.questions = [
          {
            text: 'q1',
            code: 'function',
            author: 'rus'
          },
          {
            text: 'q2',
            code: 'function()',
            author: 'rus'
          },
          {
            text: 'q3',
            code: 'function()',
            author: 'rus'
          }
        ];

        /**
         * @describe
         * Gets the statistic for each state using.
         * @param [Array] states Array of questions
         * @returns {Array} Array of usage statistic
         */
        $scope.getStats = function (questions) {
          var totalAnsweredQuestions, result;

          // Get total count of answered questions. Not answered question will not be counted.
          totalAnsweredQuestions = questions.filter(function (item) {
            return !!item.status;
          }).length;

          // Calculate stats.
          result = questions.reduce(function (memo, item) {
            if (!!item.status) {
              if (!memo[item.status]) {
                memo[item.status] = 0;
              }
              memo[item.status]++;
            }
            return memo;
          }, {});

          // Transform number to percents.
          Object.keys(result).forEach(function (key) {
            result[key] = (result[key] / totalAnsweredQuestions) * 100;
          });

          return result;
        };

        /**
         * @describe
         * Sets answered state for the question.
         * @param {String} label State's label
         */
        $scope.setQuestionState = function (question, label) {
          question.status = $scope.states[label];
        };

        /**
         * @param {Object} question Changes the current question.
         */
        $scope.selectQuestion = function (question) {
          $scope.currentQuestion = question;
        };

        $scope.removeQuestion = function (question) {
          if(confirm('Do you really want to remove this question?')) {
            lodash.remove($scope.questions, question);
          }
        };
      }
    };
  });

