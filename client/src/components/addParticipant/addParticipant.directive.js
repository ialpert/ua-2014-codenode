'use strict';

angular.module('interviewer')
  .directive('addParticipant', function(AppState, Room, $timeout, $mdDialog) {
    return {
      restrict: 'A',
      scope: {},

      link: function(scope, element, attrs) {

        element.on('click', function() {

          $mdDialog.show({
            controller: 'peopleCtrl',
            templateUrl: 'components/people/people.modal.html'
          });

        });
      }
    };
  });
