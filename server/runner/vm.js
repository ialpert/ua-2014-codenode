(function() {
  'use strict';
  var Mocha, cli, domain, fs, log, respond, result, tmp, vmDomain, _code,
    __slice = [].slice;

  cli = require('commander');

  tmp = require('tmp');

  fs = require('fs');

  domain = require('domain');

  Mocha = require('mocha');

  require('expectations');

  cli.option('-c, --code [code]', 'Provide code to be executed', '').option('-p, --print', 'Print JSON result').parse(process.argv);

  if (cli.code) {
    _code = cli.code;
  }

  result = {
    __tests: {},
    log: []
  };

  log = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    try {
      if (args.length === 1) {
        args = args[0];
      }
      return result.log.push(JSON.stringify(args));
    } catch (_error) {
      return result.log.push(null);
    }
  };

  respond = function(result) {
    if (cli.print) {
      return process.stdout.write(JSON.stringify(result, null, 2));
    }
  };

  global.console.log = log;

  vmDomain = domain.create();

  vmDomain.on('error', function(e) {
    result.__tests.error = e.message;
    result.status = 'error';
    return respond(result);
  });

  vmDomain.run(function() {
    var mocha;
    return mocha = new Mocha({
      "interface": 'bdd',
      reporter: require('./Reporter')
    }, tmp.file({
      prefix: 'task-',
      postfix: '.js'
    }, function(err, path, fd) {
      return fs.write(fd, _code, null, null, function(err, written, buffer) {
        mocha.addFile(path);
        return mocha.run(function() {
          result.__tests = process.testReport;
          result.status = 'success';
          return respond(result);
        });
      });
    }));
  });

}).call(this);
