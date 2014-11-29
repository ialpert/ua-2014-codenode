'use strict';
/**
 * @ngdoc function
 * @name interviewer.service:AttState
 * @description
 * Wrapper for the Racer's application state.
 */
angular.module('interviewer')
  .service('AppState', function(racer) {
    var state = null;

    return {
      /**
       * @description
       * Initiates application state with row data model
       * @param {Object} rawModel Model to be synchronized
       */
      init: function(rawModel) {
        state = racer.createModel(rawModel).pass({local: true});
      },

      /**
       *
       * @returns {*} Current application state
       */
      getState: function() {
        return state;
      }
    };
  });
