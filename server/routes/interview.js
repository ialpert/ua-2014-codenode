'use strict';

module.exports = function(store) {

  var model = store.createModel();

  return {

    setup: function(data, fn) {
      var userRef, sessionRef, head, session;

      userRef = model.id();
      sessionRef = model.id();

      head = {
        name: data.data.name,
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
    },

    join: function(data, fn) {
      var user, sessionRef, userRef, people;

      userRef = 'users.' + data.token;

      model.fetch(userRef, function() {
        user = model.get(userRef);

        if (user && user.interview) {

          people = model.query('people', {interview: user.interview});
          people.subscribe();

          model.set('_page.token', data.token);
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
    }

  };
};


