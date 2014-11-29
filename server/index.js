'use strict';

var env, config, express, app, fs, path, lodash, statics, server, racer, io, store,
  highway, socketIO, liveDbMongo, racerHighway, racerBundle;

env = (process.env.NODE_ENV || 'development');
config = require('./config/' + env);

fs = require('fs');
path = require('path');

lodash = require('lodash');
express = require('express');
racer = require('racer');
socketIO = require('socket.io');
liveDbMongo = require('livedb-mongo');

racerHighway = require('racer-highway');
racerBundle = require('racer-bundle');

statics = [];

app = express();

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

  console.log('App (%s) is running at: http://%s:%s', env, host, port);
});

io = socketIO(server);

racer.use(racerBundle);

store = racer.createStore({
  server: server,

  db: liveDbMongo(config.mongoose.connection, config.mongoose.options)
});

highway = racerHighway(store);

server.on('upgrade', highway.upgrade);

store.shareClient.backend.addProjection('people', 'users', 'json0', {id: true, name: true, status: true});

io.on('connection', function(socket) {

  var interview = require('./routes/interview')(store);

  socket.on('interview:setup', interview.setup);
  socket.on('interview:join', interview.join);

});

app.get('/racer.js', require('./routes/racer')(store).bundle);




