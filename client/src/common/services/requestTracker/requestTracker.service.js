'use strict';

/**
 * @ngdoc function
 * @name services.requestTracker
 * @description
 * # requestTracker
 *  Tracks the amount of both `http` and `sockets` requests.
 */
angular.module('services.requestTracker', ['services.examinerTransport']);
angular.module('services.requestTracker')
  .factory('requestTracker', function($http, IOREST){

    var requestTracker = {};

    /**
     * @ngdoc method
     * @name services.requestTracker#hasPendingRequests
     * @methodOf services.requestTracker
     * @returns {boolean} true if there is at least one pending request.
     */
    requestTracker.hasPendingRequests = function() {
      return $http.pendingRequests.length > 0 || IOREST.pendingRequests.length > 0;
    };

    return requestTracker;
  });