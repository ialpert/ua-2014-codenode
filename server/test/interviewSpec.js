process.env.NODE_ENV = 'testing';

require('../');

require('./socketSuite')({describe: 'Interview IO', socketURL: 'http://localhost:3100'}, function(suite) {

  it('interview:setup', function(done) {

    this.socket.emit('interview:setup', {name: 'Test head'}, function(data) {

      done();
    });

  });

  it('interview:join', function(done) {

    this.socket.emit('interview:join', {}, function(data) {

      done();
    });
  });

});
