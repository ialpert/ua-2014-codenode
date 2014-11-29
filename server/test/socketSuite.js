'use strict';

var io, lodash, defaultSuite, async;

io = require('socket.io-client');
lodash = require('lodash');
async = require('async');

require('expectations');

defaultSuite = {
  timeout: 1000,
  describe: 'Noname socket.io suite',
  socketURL: 'http://localhost:3010',

  personateFlow: function(id) {

    return [
      function(cb) {
        cb(id);
      }
    ];
  },

  success: function(data) {
    expect(data.error).toBeFalsey();
    expect(data.result).toBeDefined();
  },

  fail: function(data) {
    expect(data.error).toBeDefined();
    expect(data.result).toBeFalsey();
  }
};

module.exports = function(suite, fn) {

  suite = lodash.defaults(suite, defaultSuite);

  describe(suite.describe, function() {
    var socket;

    beforeEach(function(done) {
      var _log, _this;

      _this = this;
      _this.timeout(suite.timeout);

      _this.log = function(log) {
        _log = !!log;
      };

      _this.personate = function(id, fn) {
        var ready;

        ready = function() {

          socket = io.connect(suite.socketURL, {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true
          });

          socket.on('connect', function() {
            fn.call(_this);
          });

          _this._socket = socket;

          _this.socket = {
            emit: function(eventName, model, fn) {

              socket.emit(eventName, model, function(response) {

                if (_log) {
                  console.log("\n\n");
                  console.log(eventName + ' -> ' + JSON.stringify(model, null, 2));
                  console.log("\n\n");
                  console.log(eventName + ' <- ' + JSON.stringify(response, null, 2));
                }

                fn(response);

                _log = false;
              });
            }
          };

        };

        async.waterfall(suite.personateFlow(id), ready);
      };

      _this.log(false);
      _this.personate(null, done);
    });

    afterEach(function(done) {
      socket.disconnect();
      done();
    });

    fn(suite);
  });

};
