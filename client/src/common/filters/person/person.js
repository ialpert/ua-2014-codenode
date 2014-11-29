'use strict';

angular.module('interviewer')
  .filter('person', function(AppState) {
    var people = AppState.getState().at('people');

    return function(id) {
      return people.at(id).get('name') || id;
    };
  });
