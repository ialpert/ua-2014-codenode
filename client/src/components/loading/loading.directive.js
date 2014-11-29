'use strict';

/**
 * @ngdoc directive
 * @name interviewer.directive:loading
 * @description
 * Handles amount of pending request and shows or hides a content of this directive.
 *
 * ```
 *  <loading><img src="ajax-spinner.gif" /></loading>
 * ```
 */
angular.module('interviewer')
  .directive('loading', function (requestTracker) {
    return {
      template: '<div class="fade" ng-class="{in: hasPendingRequests(), out: !hasPendingRequests()}" ng-transclude></div>',
      restrict: 'EA',
      transclude: true,
      scope: true,
      replace: true,
      link: function postLink(scope) {
        scope.hasPendingRequests = function() {
          return requestTracker.hasPendingRequests();
        };
      }
    };
  });
