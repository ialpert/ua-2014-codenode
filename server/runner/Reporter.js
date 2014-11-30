(function() {
  var BaseReporter, Reporter;

  BaseReporter = require('mocha/lib/reporters/base');

  module.exports = Reporter = function(runner) {
    var addTest, path, result;
    BaseReporter.call(this, runner);
    result = {
      total: 0,
      succeed: 0,
      failed: 0,
      expects: 0,
      tests: []
    };
    path = [];
    addTest = function(test, err) {
      var _test;
      if (err == null) {
        err = null;
      }
      _test = {
        status: err ? 'failed' : 'success',
        title: test.title,
        _path: path[0] ? path.slice(0) : path.slice(1)
      };
      if (err) {
        _test.error = err.message;
      }
      return result.tests.push(_test);
    };
    runner.on('suite', function(suite) {
      return path.push(suite.title);
    });
    runner.on('suite end', function(suite) {
      return path.pop();
    });
    runner.on('pass', function(test) {
      return addTest(test);
    });
    runner.on('fail', function(test, err) {
      return addTest(test, err);
    });
    return runner.on('end', function() {
      result.total = runner.stats.tests;
      result.succeed = runner.stats.passes;
      result.failed = runner.stats.failures;
      result.duration = runner.stats.duration;
      return process.testReport = result;
    });
  };

}).call(this);
