'use strict';

angular.module('interviewer')
  .directive('remoteVideo', function() {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        angular.element(elem).find('.video-holder').append(scope.peer.videoEl);
      }
    };
  });
