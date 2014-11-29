'use strict';

describe('Service: IOREST', function () {
  //it('should handle io absence', function () {
  //  var _io = io;
  //  expect(function () {
  //    io = void 0;
  //    inject(function (IOREST) {});
  //  }).toThrow(new Error('IOREST can\'t work without socket.io included.'));
  //  io = _io;
  //});

  // load the service's module
  beforeEach(module('interviewer'));
  beforeEach(module('services.examinerTransport'));

  // instantiate service
  var IOREST, _, $httpBackend;

  beforeEach(inject(function (_IOREST_, lodash, _$httpBackend_) {
    IOREST = _IOREST_;
    _ = lodash;
    $httpBackend = _$httpBackend_;
    // Fix for the strange bug with ui-router. It seems ui-router uses the same
    // state machine as httpBackend and makes external requests for the views.
    $httpBackend.expectGET('common/controllers/login/login.controller.html').respond({});
  }));

  describe('configuration', function () {
    it('should have ability to be configurable in run time', function () {
      var config = {
        uri: 'http://google.com',
        token: 'dfgd3453545435ergtertdfg',
        separator: '/'
      };

      IOREST.setConfig(config);
      expect(IOREST.getConfig().uri).toBe('http://google.com');

      config.uri = null;
      IOREST.setConfig(config);
      expect(IOREST.getConfig().uri).toBe(null);
    });

    it('should provide correct parsers', function () {
      expect(IOREST.parsers.default({result: 10})).toBe(10);
      expect(IOREST.parsers.proxy({result: 10})).toEqual({result: 10});
    });

    it('should provide correct wrappers', function () {
      expect(IOREST.wrappers.default({id: 10}).data).toEqual({id: 10});
      expect(IOREST.wrappers.filter({id: 10}).filter).toEqual({id: 10});
      expect(IOREST.wrappers.proxy({id: 10}).id).toEqual(10);
    });

    it('should have ability to connect with default uri', function () {
      spyOn(io, 'connect');
      IOREST.connect();
      expect(io.connect).toHaveBeenCalledWith();
    });

    it('should have ability to connect with specified uri', function () {
      spyOn(io, 'connect');
      IOREST.setConfig({uri: 'google.com'});
      IOREST.connect();
      expect(io.connect).toHaveBeenCalledWith('google.com');
    });
  });

  describe('error handling', function () {
    it('should throw an error when the endpoint is not specified or specified incorrectly', function () {
      expect(function () {
        IOREST.createService();
      }).toThrow(new Error('Endpoint should be specified and should be a string.'));

      expect(function () {
        IOREST.createService(':-unit  ');
      }).toThrow(new Error('Endpoint should contain only alphabetical chars and digits.'));
    });


  });

  describe('instantiating', function () {
    it('should lowercases the endpoint of the service', function () {
      expect(IOREST.createService('Unit').getEndpoint()).toBe('unit');
    });

    it('should add a prefix to all events', function () {
      expect(IOREST.createService('Unit')._compile('get')).toBe('unit:get');

      IOREST.setConfig({prefix: '[socketio]'});

      expect(IOREST.createService('Unit')._compile('get')).toBe('[socketio]unit:get');
      expect(IOREST.createService('Unit')._compile('edit')).toBe('[socketio]unit:edit');
    });

    it('should add API methods for the instance of transport', function () {
      var Unit = IOREST.createService('Unit', {
        update: {
          action: 'update',
          parse: function (response) {
            return response;
          }
        },
        do: {
          action: 'do'
        }
      });

      expect(Unit.do).toBeDefined();
      expect(Unit.update).toBeDefined();
      expect(Unit.get).toBeDefined();
    });

    it('should return unresolved promises', function () {
      var Unit = IOREST.createService('Unit');
      var def = Unit.edit({id: 20, name: 'some name'});
      expect(def.then).toBeDefined();
      expect(def.catch).toBeDefined();
      expect(def.finally).toBeDefined();
    });

    it('should wrap model with token', function () {
      IOREST.setConfig({token: '1234qwer'});
      expect(IOREST.wrappers.default({id: 10, name: 'John do'}).data).toEqual({
          id: 10,
          name: 'John do'
        });
    });
  });

  describe('sockets interaction', function () {
    var Unit;
    beforeEach(function () {
      Unit = IOREST.createService('Unit');
    });
    afterEach(function () {
      IOREST.socket.removeAllListeners();
    });

    it('should emmit correct message', inject(function ($q, $rootScope) {
      var def, result;
      IOREST.setConfig({
        defaultWrapper: IOREST.wrappers.default
      });
      // Emulating server-side controller
      IOREST.socket.on('unit:edit', function (data, callback) {
        data = _.clone(data);
        data.success = true;
        callback({
          result: data
        });
      });
      // Client side
      def = Unit.edit({
        id: 10,
        name: 'Basics'
      });

      def.then(function (response) {
        result = response;
      });

      $rootScope.$apply();

      expect(result.data).toEqual({
        id: 10,
        name: 'Basics'
      });
      expect(result.success).toEqual(true);

    }));

    it('should reject the promise with appropriate error', inject(function ($q, $rootScope) {
      var def, result;
      IOREST.setConfig({
        defaultWrapper: IOREST.wrappers.default
      });

      // Emulating server-side controller
      IOREST.socket.on('unit:edit', function (data, callback) {
        callback({
          error: 'Error: session is expired'
        });
      });
      // Client side
      def = Unit.edit({
        id: 10,
        name: 'Basics'
      });

      def.catch(function (response) {
        result = response;
      });

      $rootScope.$apply();

      expect(result.message).toBe('Error: session is expired');
      expect(result.action.event).toBe('unit:edit');
      expect(result.action.model.data).toEqual({
        id  : 10,
        name: 'Basics'
      });
    }));
  });

  describe('emmiter handling', function () {
    beforeEach(function () {
      IOREST.socket.removeAllListeners();
      IOREST.pendingRequests.length = 0;
    });
    beforeEach(function () {
      IOREST.pendingRequests.length = 0;
    });
    it('should handle emits pull', function () {
      var Unit = IOREST.createService('Unit'),
          Task = IOREST.createService('Task');

      // Emulating server-side controller
      IOREST.socket.on('unit:get', function (data, callback) {
        callback({
          result: {}
        });
      });
      // Apparently it's not a good test cause it doesn't
      // use real socket.io and I should create the same buffer
      // in the mock. So leave it as it is.
      // @todo (mock): refactor or remove this test.
      expect(IOREST.pendingRequests.length).toBe(0);

      Unit.get();
      expect(IOREST.pendingRequests.length).toBe(0);

      Task.get();
      expect(IOREST.pendingRequests.length).toBe(1);


    });
  });
});
