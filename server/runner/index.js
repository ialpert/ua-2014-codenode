(function() {
  'use strict';
  var KILLSIGNAL, VMs, async, childProcess, fs, lodash, path;

  fs = require('fs');

  path = require('path');

  lodash = require('lodash');

  async = require('async');

  childProcess = require('child_process');

  VMs = {
    node: 'js',
    coffee: 'coffee'
  };

  KILLSIGNAL = 'SIGKILL';

  module.exports = {
    RUNNER_TYPE: process.env.RUNNER_TYPE,
    RUNNER_DIR: process.env.RUNNER_DIR,
    EXT: VMs[process.env.RUNNER_TYPE],
    run: function(options) {
      var defaults, flow, reporter;
      reporter = null;
      defaults = {
        code: '',
        tests: '',
        preload: '',
        strict: true,
        timeout: 1000,
        runnerType: module.exports.RUNNER_TYPE,
        vm: "" + __dirname + "/vm." + module.exports.EXT,
        vmTemplate: path.normalize("" + module.exports.RUNNER_DIR + "/vm.tpl/js.ejs"),
        report: function() {
          return false;
        }
      };

      flow = [
        function(fn) {
          options = lodash.defaults(options, defaults);
          reporter = options.report;
          return fs.exists(options.vmTemplate, function(exists) {
            if (exists) {
              return fn(null, options);
            } else {
              return fn({
                message: "VM template does not exist: " + options.vmTemplate
              });
            }
          });
        }, function(options, fn) {
          return fs.readFile(options.vmTemplate, 'utf8', function(err, tpl) {
            return fn(err, tpl, options);
          });
        }, function(code, options, fn) {
          var _code;
          _code = lodash.template(code)(options);
          return fn(null, _code, options);
        }, function(code, options, fn) {
          var execArgs, execOpts;
          execArgs = [options.vm, '-p', '-c', code];
          execOpts = {
            timeout: options.timeout,
            killSignal: KILLSIGNAL
          };
          return fn(null, execArgs, execOpts, options, code);
        }, function(execArgs, execOpts, options, code, fn) {
          var execFn, result;
          result = {
            __tests: {
              error: '',
              total: 0,
              succeed: 0,
              failed: 0,
              expects: 0,
              tests: []
            },
            log: []
          };
          execFn = function(err, stdout) {
            if (err) {
              if (err.signal === execOpts.killSignal) {
                result.__tests.error = 'Script execution timed out';
              } else {
                result.__tests.error = err.message;
              }
            }
            if (stdout) {
              try {
                result = JSON.parse(stdout);
                result.code = code;
              }
              catch (_error) {}
            } else {
              while (!result.__tests.error) {
                result.__tests.error = 'Empty stdout';
              }
            }
            return fn(null, result, options);
          };
          return childProcess.execFile(options.runnerType, execArgs, execOpts, execFn);
        }
      ];
      return async.waterfall(flow, function(err, result) {
        if (err) {
          if (result == null) {
            result = {
              __tests: {
                error: err.message
              }
            };
          }
        }
        return reporter(result);
      });
    }
  };

}).call(this);
