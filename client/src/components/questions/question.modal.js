'use strict';

/**
 * @ngdoc function
 * @name interviewer.controller:QuestionsModalCtrl
 * @description
 * Controller for the question edit popup.
 */
angular.module('interviewer')
  .controller('QuestionsModalCtrl', function($scope, $mdDialog, question) {
    /**
     * Current question
     */
    $scope.question = question;

    /**
     * @description
     * Closes and saves question.
     * @param {Object} question
     */
    $scope.close = function(question) {
      $mdDialog.hide(question);
    };

    /**
     * @description
     * Just closes the popup without saving
     */
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });
