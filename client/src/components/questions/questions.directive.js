'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:questions
 * @description
 * Directive for the question list.
 */
angular.module('interviewer')
  .directive('questions', function($mdDialog, AppState, lodash, Room, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'components/questions/questions.directive.html',
      scope: {},
      link: function($scope) {
        var questionsSync, currentQuestionSync;

        // OT staff
        questionsSync = AppState.getState().at('_page.session').at('questions');
        currentQuestionSync = AppState.getState().at('_page.session').at('currentQuestionSync');

        // Set default values if they have not been instantiated yet.
        questionsSync.setNull({});

        // Syncing main question list
        questionsSync.on('change', '**', function(path, val, oldVal, passed) {

          if (passed && !passed.local) {
            $timeout(function() {
              $scope.questions = lodash.values(lodash.cloneDeep(questionsSync.get()));
            });
          }

          if (!oldVal) {
            $scope.questions.push(val);
          }

        });

        questionsSync.on('all', '**', function(path, val, oldVal, passed) {
          console.log(arguments);
        });

        /**
         * List of question states.
         * @type {{label: string}[]}
         */
        $scope.states = {
          'success': 'success',
          'so-so': 'warning',
          'oops...': 'danger'
        };

        $scope.questions = lodash.values(lodash.cloneDeep(questionsSync.get()));
        $scope.currentQuestionSync = currentQuestionSync.get();

        currentQuestionSync.on('change', '', function(val, oldVal) {
          $scope.currentQuestionSync = val;
        });

        /**
         * @describe
         * Gets the statistic for each state using.
         * @param {Object} questions Array of questions
         * @returns {Object} Array of usage statistic
         */
        $scope.getStats = function(questions) {
          var totalAnsweredQuestions, result;

          // Get total count of answered questions. Not answered question will not be counted.

          if (!questions) {
            return {};
          }

          totalAnsweredQuestions = questions.filter(function(item) {
            return !!item.status;
          }).length;

          // Calculate stats.
          result = questions.reduce(function(memo, item) {
            if (!!item.status) {
              if (!memo[item.status]) {
                memo[item.status] = 0;
              }
              memo[item.status]++;
            }
            return memo;
          }, {});

          // Transform number to percents.
          Object.keys(result).forEach(function(key) {
            result[key] = (result[key] / totalAnsweredQuestions) * 100;
          });

          return result;
        };

        /**
         * @describe
         * Sets answered state for the question.
         * @param question
         * @param {String} status State's status
         */
        $scope.setQuestionState = function(question, status) {

          questionsSync.at(question.id).set('status', status, function() {
            console.log(111);
            question.status = status;
          });
        };

        /**
         * @param {Object} question Changes the current question.
         */
        $scope.selectQuestion = function(question) {
          currentQuestionSync.set(question.id);
        };

        /**
         *
         * @param $event
         * @param {Object} question Question to remove.
         */
        $scope.removeQuestion = function($event, question) {
          $event.stopPropagation();

          if (confirm('Do you really want to remove this question?')) {
            questionsSync.del(question.id);
          }
        };

        /**
         * @description
         * Open the add/edit popup for the current or new question
         * @param {Object} question Question to edit
         */
        $scope.showEditQuestionPopup = function($event, question) {
          $event.stopPropagation();

          var isNew = !question;

          // Open the dialog
          $mdDialog.show({
            controller: 'QuestionsModalCtrl',
            templateUrl: 'components/questions/question.modal.html',
            locals: {
              question: isNew ? {} : lodash.cloneDeep(question)
            }
          })
            .then(function(questionFromPopup) {
              var data;

              if (isNew) {
                questionFromPopup.id = questionsSync.id();
                questionFromPopup.author = Room.token;
              }

              data = lodash.pick(questionFromPopup, 'id', 'text', 'editor', 'author', 'status');

              questionsSync.set(data.id, data);

              $scope.questions.map(function(item, idx) {
                if (data.id === item.id) {
                  $scope.questions[idx] = lodash.merge(item, data);
                }
              });

            });
        };
      }
    };
  });

