'use strict';

module.exports = {
  express: {
    listen: 3000,

    static: [
      ['/', 'client/src']
    ]
  },

  mongoose: {
    connection: 'mongodb://localhost/interviewer-dev',
    options: {
      server: {
        auto_reconnect: true
      }
    }
  }
};
