'use strict';

module.exports = {
  express: {
    listen: 3500,

    static: [
      ['/', 'client/build']
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
