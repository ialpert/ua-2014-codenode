'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('interviewer'));
  beforeEach(module('stateMock'));
  var LoginCtrl,
      scope,
      toaster,
      IOREST;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _IOREST_) {
    scope = $rootScope.$new();
    IOREST = _IOREST_;

    toaster = {
      pop: function () {}
    };

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      toaster: toaster
    });
  }));

  it('should notify user when error is occurred.', function () {
    spyOn(toaster, 'pop');
    IOREST.socket.on('interview:setup', function (data, callback) {
      callback({
        error: 'session is expired',
        result: {
          _id: '87dfgdfg'
        }
      });
    });
    scope.createSession();
    scope.$digest();
    expect(toaster.pop).toHaveBeenCalledWith('error', 'Session Setup', jasmine.any(String));
  });

  xit('should change the application state on success', inject(function ($state) {
    $state.expectTransitionTo('session');
    IOREST.socket.on('interview:setup', function (data, callback) {
      callback({
        token: '',
        result: {
          sessionId: 10
        }
      });
    });

    scope.createSession();
    $state.ensureAllTransitionsHappened();
  }));
});
