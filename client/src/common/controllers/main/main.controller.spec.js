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
      $scope: scope
    });
  }));
  // TODO (mock): create real test
  it('should attach a list of awesomeThings to the scope', function () {
    expect(true).toBeTruthy();
  });
});
