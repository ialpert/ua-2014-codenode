'use strict';

module.exports = {
  express: {
    listen: 3500,

    static: [
      ['/', 'client/build']
    ]
  },

  mongoose: {
    connection: 'mongodb://nodejitsu:408cf1f78d7df5d2edc2edac78553178@troup.mongohq.com:10073/nodejitsudb2934462456',
    options: {
      server: {
        auto_reconnect: true
      }
    }
  }
};
