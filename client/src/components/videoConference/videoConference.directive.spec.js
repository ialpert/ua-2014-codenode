'use strict';

describe('Directive: questions', function () {

  // load the directive's module
  beforeEach(module('interviewer'));
  //beforeEach(module('templates'));

  var element, scope, $rootScope, $httpBackend;

  beforeEach(inject(function (_$rootScope_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    // Fix for the strange bug with ui-router. It seems ui-router uses the same
    // state machine as httpBackend and makes external requests for the views.
    $httpBackend.expectGET("components/videoConference/videoConference.directive.html").respond({});
  }));

  xit('should calculate statistic in correct way', inject(function ($compile) {
    element = angular.element('<video-conference></video-conference>');
    console.log(element);
    element = $compile(element)(scope);

    scope.$digest();
    expect(scope.getStats(questions)).toEqual({
      'success': 2,
      'so-so': 1,
      'oops...': 1
    });
  }));
});
