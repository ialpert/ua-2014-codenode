'use strict';

/**
 * @ngdoc overview
 * @name interviewer
 * @description
 * # interviewer
 *
 * Application router.
 */
angular.module('interviewer')
  .config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/');

    // Now set up the states
    $stateProvider
      .state('session', {
        url: '/session/:id/',
        templateUrl: 'common/controllers/main/main.controller.html',
        controller: 'MainCtrl',
        resolve: {
          session: function(Session, $stateParams, IOREST, Room, AppState) {
            var session;

            // Set current room id as token for all requests
            IOREST.setConfig({
              token: $stateParams.id
            });

            // Join to the room
            session = Session.join({
              hash: $stateParams.id
            });

            // Init application state and global room value.
            session.then(function(rawModel) {

              // Init AppState with raw model from the server.
              AppState.init(rawModel);

              // Setup room
              Room.token = AppState.getState().at('_page.user.id').get();
              Room.interview = AppState.getState().at('_page.user.interview').get();
              Room.me = AppState.getState().at('_page.user').getCopy();
            });

            return session;
          }
        }
      })
      .state('login', {
        url: '/',
        templateUrl: 'common/controllers/login/login.controller.html',
        controller: 'LoginCtrl'
      });
  });
