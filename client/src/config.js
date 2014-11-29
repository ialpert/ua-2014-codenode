'use strict';

/**
 * @ngdoc service
 * @name interviewer.config
 * @description
 * # config
 * Constants in the interviewer.
 */
angular.module('interviewer')
  .constant('config', {
    log: true,
    webrtcSignalingUrl: 'https://signaling.simplewebrtc.com:443'
  });
