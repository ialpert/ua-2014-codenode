'use strict';

var env, config, express, app, fs, path, lodash, statics, server, racer, io, store, highway;

env = process.env.NODE_ENV || 'development';

config = require('./config/' + env);
fs = require('fs');
path = require('path');
lodash = require('lodash');
express = require('express');
racer = require('racer');

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

io = require('socket.io')(server);

racer.use(require('racer-bundle'));

store = racer.createStore({
  server: server,

  db: require('livedb-mongo')(config.mongoose.connection, config.mongoose.options)
});

highway = require('racer-highway')(store);

server.on('upgrade', highway.upgrade);

store.shareClient.backend.addProjection('people', 'users', 'json0', {id: true, name: true, status: true});

io.on('connection', function(socket) {

  var interview = require('./routes/interview')(store);

  socket.on('interview:setup', interview.setup);
  socket.on('interview:join', interview.join);

});

app.get('/racer.js', require('./routes/racer')(store).bundle);




