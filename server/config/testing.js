'use strict';

module.exports = {
  express: {
    listen: 3100,

    static: []
  },

  mongoose: {
    connection: 'mongodb://localhost/interviewer-testing',
    options: {
      server: {
        auto_reconnect: true
      }
    }
  }
};
