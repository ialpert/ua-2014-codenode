'use strict';

angular.module('interviewer', [
  'ngAnimate',
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ngMaterial',
  'toaster',
  'ui.ace',
  'racer',
  'services.examinerTransport',
  'services.requestTracker',
  'ngClipboard',
  'ui.sortable'
])
  .config(function(ngClipProvider) {
    ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  })

  // Setup $log service
  .config(function($logProvider, config) {
    $logProvider.debugEnabled(config.log);
  })

  // Making a trailing slash optional for all routes
  .config(function($urlRouterProvider) {
    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.url();

      // check to see if the path already has a slash where it should be
      if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
        return;
      }

      if (path.indexOf('?') > -1) {
        return path.replace('?', '/?');
      }

      return path + '/';
    });
  })

  //Configuring and run sockets.
  .config(function(IORESTProvider) {
    IORESTProvider.setConfig({
      defaultWrapper: IORESTProvider.wrappers.default,
      opts: {
        transports: ['websocket']
      }
    });
    IORESTProvider.connect();
  })

  // Setup security system based on the roles and make other useful actions.
  .run(function($rootScope, $location, $state, IOREST, toaster, $log) {

    // Setup global error notification handler for the sockets.
    IOREST.socket.on('error', function(error) {
      toaster.pop('error', 'Connection Trouble', 'Open console to see more details about this error.');
      $log.error(error);
    });

    IOREST.socket.on('disconnect', function(error) {
      toaster.pop('error', 'Connection Failed', 'Connection with the server has been failed.');
      $log.error(error);
    });

    IOREST.socket.on('reconnect', function() {
      toaster.pop('success', 'Connection Established', 'Successful reconnection to the server.');
    });

    // Useful utility for hte safest scope applying.
    $rootScope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  });
