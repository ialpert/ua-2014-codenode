'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:questions
 * @description
 * Directive for the question list.
 */
angular.module('interviewer')
  .directive('questions', function ($mdDialog, AppState, lodash, Room, $timeout) {
    return {
      restrict   : 'E',
      templateUrl: 'components/questions/questions.directive.html',
      scope      : {},
      link       : function ($scope) {
        var questionsSync, currentQuestionSync;

        // OT staff
        questionsSync = AppState.getState().at('_page.session').at('questions');

        // Set default values if they have not been instantiated yet.
        questionsSync.setNull([]);

        // Syncing main question list
        questionsSync.on('all', '**', function(questionId, vals, passed) {
          if (passed && !passed.local) {
            $timeout(function () {
              $scope.questions = questionsSync.getDeepCopy();
            });
          }
        });

        /**
         * List of question states.
         * @type {{label: string}[]}
         */
        $scope.states = {
          'success': 'success',
          'so-so'  : 'warning',
          'oops...': 'danger'
        };

        $scope.questions = questionsSync.getDeepCopy();


        /**
         * @describe
         * Gets the statistic for each state using.
         * @param {Array} questions Array of questions
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
          questionsSync.at($scope.questions.indexOf(question)).set('status', question.status);
        };

        /**
         * @param {Object} question Changes the current question.
         */
        $scope.selectQuestion = function (question) {
          $scope.questions.forEach(function (q) {
            q.isCurrent = false;
          });
          question.isCurrent = true;
          questionsSync.set(angular.copy($scope.questions));
        };

        /**
         *
         * @param {Object} question Question to remove.
         */
        $scope.removeQuestion = function ($event, question) {
          $event.stopPropagation();
          if (confirm('Do you really want to remove this question?')) {
            questionsSync.remove($scope.questions.indexOf(question));
            lodash.remove($scope.questions, question);
          }
        };

        //$scope.onSort = function(e, ui) {
        //  questionsSync.move(ui.item.beforeIdx, ui.item.index());
        //};
        //
        //$scope.beforeSort = function(e, ui) {
        //  ui.item.beforeIdx = ui.item.index();
        //};

        /**
         * @description
         * Open the add/edit popup for the current or new question
         * @param {Object} question Question to edit
         */
        $scope.showEditQuestionPopup = function ($event, question) {
          $event.stopPropagation();

          var isNew = !question;

          // Open the dialog
          $mdDialog.show({
            controller : 'QuestionsModalCtrl',
            templateUrl: 'components/questions/question.modal.html',
            locals     : {
              question: isNew ? {} : angular.copy(question)
            }
          })
            .then(function (questionFromPopup) {
              // @todo(M.O.C.K.): No time for explaining, just keep it as is for the demo.
              if (isNew) {
                questionFromPopup.author = Room.token;
                $scope.questions.push(questionFromPopup);
                questionsSync.push(questionFromPopup);
              } else {
                question.text = questionFromPopup.text;
                question.editor = questionFromPopup.editor;
                question.author = Room.token;
                questionsSync.set($scope.questions.indexOf(question), angular.copy(question));
              }
            });
        };
      }
    };
  });

