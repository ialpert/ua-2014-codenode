angular.module('interviewer')
  .controller('peopleCtrl', function($scope, AppState, Room, lodash, $timeout) {
    var people;

    $scope.statuses = ['expert', 'candidate'];

    $scope.newPerson = {
      status: $scope.statuses[0]
    };

    people = AppState.getState().at('people').pass({local: true});

    people.on('all', '**', function(path, val, passed) {
      $timeout(function() {
        $scope.people = lodash.values(people.getCopy());
      });
    });

    $scope.people = lodash.values(people.getCopy());

    /**
     * @description
     * Just closes the popup without and additional actions.
     */
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.reject = function(user) {
      people.del(user.id);
    };

    /**
     * @description
     * Add participant to the session.
     */
    $scope.join = function(newUser) {

      newUser.interview = Room.interview;
      newUser.id = AppState.getState().id();

      AppState.getState().at('users').add(newUser);
    };

  });
