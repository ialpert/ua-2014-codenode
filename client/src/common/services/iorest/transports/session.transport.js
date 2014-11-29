'use strict';

/**
 * @ngdoc service
 * @name interviewer.session
 * @description
 * Session IOREST transport.
 */
angular.module('interviewer')
  .factory('Session', function(IOREST) {
    return IOREST.createService('Session', {
      setup: {
        action: 'setup'
      },
      invite: {
        action: 'invite'
      },
      join: {
        action: 'join'
      }

    });
  });
