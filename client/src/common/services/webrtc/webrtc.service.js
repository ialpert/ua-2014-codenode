'use strict';

/**
 * @ngdoc function
 * @name room
 * @description
 * # webrtc
 */
angular.module('interviewer')
  .factory('WebRTC', function() {
    return window.SimpleWebRTC;
  });
