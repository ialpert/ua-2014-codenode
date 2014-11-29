'use strict';

/**
 * @ngdoc function
 * @name interviewer.controller:LoginCtrl
 * @description
 * # MainCtrl
 * Controller of the login page.
 */
angular.module('interviewer')
  .controller('LoginCtrl', function($scope, Session, $state, $log, toaster) {
    // Setup head name variable.
    $scope.headName = '';

    /**
     * @ngdoc method
     * @description
     * Creates a session and then redirects to the appropriate room page.
     */
    $scope.createSession = function() {
      Session.setup({
        name: $scope.headName
      })
      .then(function(response) {
        $state.go('session', {
          id: response.accessId
        });
      })
      .catch(function(error) {
        toaster.pop('error', 'Session Setup', 'Session setup is failed by some reasons. See console for more details.');
        $log.error(error);
      });
    };
  });
