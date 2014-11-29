'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('interviewer'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      toaster: {
        pop: function () {}
      }
    });
  }));
  // TODO (mock): create real test
  xit('should great the user with toaster', function () {

  });
});
