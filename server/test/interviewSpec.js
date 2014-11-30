process.env.NODE_ENV = 'testing';

require('../');

require('./socketSuite')({describe: 'Interview IO', socketURL: 'http://localhost:3100'}, function(suite) {

  var headAccessId;

  it('interview:setup', function(done) {

    this.socket.emit('interview:setup', {data: {name: 'Test head'}}, function(data) {

      suite.success(data);
      expect(data.result.accessId).toBeDefined();

      headAccessId = data.result.accessId;
      done();
    });

  });

  it('interview:setup -- invalid', function(done) {

    this.socket.emit('interview:setup', {}, function(data) {
      suite.fail(data);
      done();
    });
  });

  it('interview:join', function(done) {

    this.socket.emit('interview:join', {token: headAccessId}, function(data) {
      var page;

      suite.success(data);
      page = data.result.collections._page;

      expect(page.token).toBeDefined();
      expect(page.sessionToken).toBeDefined();
      expect(page.user).toBeDefined();

      done();
    });
  });

  it('interview:execute', function(done) {

    this.socket.emit('interview:execute', {data: {code: 'var a = 5;'}}, function(data) {
      suite.success(data);
      done();
    });

  });

  it('interview:execute', function(done) {

    this.socket.emit('interview:execute', {data: {code: 'var a = b;'}}, function(data) {
      expect(data.error).toBe('b is not defined');
      done();
    });

  });

});
