'use strict';

module.exports = function(store) {
  var leet, model, path;

  leet = require('l33teral');
  path = require('path');
  model = store.createModel();

  return {

    setup: function(data, fn) {
      var userRef, sessionRef, head, session;

      userRef = model.id();
      sessionRef = model.id();

      data = leet(data);

      if (!data.probe('data.name')) {
        fn({
          result: null,
          error: 'No head information provided'
        });

      } else {

        head = {
          name: data.tap('data.name'),
          status: 'head',
          interview: sessionRef
        };

        session = {};

        model.set('users.' + userRef, head, function() {
          model.set('interviewSession.' + sessionRef, session, function() {

            fn({
              result: {
                accessId: userRef
              },

              error: null
            });

          });
        });
      }
    },

    join: function(data, fn) {
      var user, sessionRef, userRef, people;

      data = leet(data);

      if (data.probe('token')) {

        userRef = 'users.' + data.tap('token');

        model.fetch(userRef, function() {
          user = model.get(userRef);

          if (user && user.interview) {

            people = model.query('people', {interview: user.interview});
            people.subscribe();

            model.set('_page.token', data.tap('token'));
            model.set('_page.sessionToken', user.interview);

            sessionRef = 'interviewSession.' + user.interview;

            model.ref('_page.user', userRef);
            model.ref('_page.session', sessionRef);

            model.subscribe('_page.user', '_page.session', function() {

              model.bundle(function(err, bundle) {

                fn({
                  result: bundle,
                  error: null
                });
              });
            });

          } else {
            fn({
              error: 'Invalid user session token'
            });
          }
        });
      } else {
        fn({
          result: null,
          error: 'No token information provided'
        });
      }

    },

    execute: function(data, fn) {

      process.env.RUNNER_TYPE = 'node';
      process.env.RUNNER_DIR = path.resolve(__dirname + '/../runner');

      var Runner = require('../runner');

      Runner.run({
        code: data.data.code || '',
        preload: '',
        tests: '',
        timeout: 1000,
        displayErrors: true,
        report: function(report) {

          if (report.status === 'success') {
            fn({
              error: null,
              result: report
            });

          } else {
            fn({
              error: report.__tests.error,
              result: report
            });
          }
        }
      });

    }
  };
};


