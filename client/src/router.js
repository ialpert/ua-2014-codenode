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
        controller: 'MainCtrl'
      })
      .state('login', {
        url: '/',
        templateUrl: 'common/controllers/login/login.controller.html',
        controller: 'LoginCtrl'
      });
  });
