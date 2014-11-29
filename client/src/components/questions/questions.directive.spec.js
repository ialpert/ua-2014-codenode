'use strict';

describe('Directive: loading', function () {

  // load the directive's module
  beforeEach(module('interviewer'));

  var element, scope, $rootScope, $httpBackend;

  beforeEach(inject(function (_$rootScope_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    // Fix for the strange bug with ui-router. It seems ui-router uses the same
    // state machine as httpBackend and makes external requests for the views.
    $httpBackend.expectGET("components/questions/questions.directive.html").respond({});
    $httpBackend.expectGET("common/controllers/login/login.controller.html").respond({});
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<questions>loading</questions>');
    element = $compile(element)(scope);
    $rootScope.$apply();
    //expect(element.hasClass('in')).toBeTruthy();
  }));
});
