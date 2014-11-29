'use strict';

/**
 * @ngdoc service
 * @name interviewer.session
 * @description
 * Session IOREST transport.
 */
angular.module('interviewer')
  .factory('Session', function(IOREST) {
    return IOREST.createService('Interview', {
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
