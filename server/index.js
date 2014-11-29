'use strict';

var env, config, express, app, fs, path, lodash, statics, server;

env = process.env.NODE_ENV || 'development';

config = require('./config/' + env);
fs = require('fs');
path = require('path');
lodash = require('lodash');
express = require('express');
app = express();

statics = [];

lodash.each(config.express.static, function(route) {
  if ((route[1])) {
    app.use(route[0], express.static(route[1]));
    statics.push(route[1]);

  } else {
    app.use(express.static(route[0]));
    statics.push(route[0]);
  }
});

server = app.listen(config.express.listen, function() {

  var host, port;

  host = server.address().address;
  port = server.address().port;

  console.log('http://%s:%s', host, port);
});



