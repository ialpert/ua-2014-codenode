'use strict';

/**
 * @ngdoc service
 * @name services.examinerTransport.IOREST
 * @description
 * # REST-like wrapper for the socket.io service.
 * IOREST is a simple wrapper over the socket.io transport. The main idea of this service is
 * to provide a simple way to communicate with the server through the sockets.
 *
 * # How does it work.
 * IOREST uses undocumented sockets.io feature (at lest in version 0.9.x) that provides
 * ability to pass third param to the `emit` function as callback and a server can execute
 * this callback passing some result data into it. In this way we can emulate HTTP REST
 * methods, but without making a lot of round trips to the server. It's much more simpler and
 * faster than using common approach with HTTP REST. Server should strongly support the same
 * protocol and should have the same socket events.
 *
 * # Configuration
 * You may configure IOREST as usual in configuration phase of the application passing IORESTProvider,
 * but in addition you may want to change some setting in runtime (i.e. token) and IOREST is able
 * to do this. All is what you need to do is to call `IOREST.setConfig()` method.
 *
 * <pre>
 *   IOREST.setConfig({
 *     uri      : 'localhost',
 *     token    : '76dfgDFSDFSDFYTYYT',
 *     separator: ':',
 *     prefix   : '',
 *     defaultParser: IOREST.parsers.default,
 *     defaultWrapper: IOREST.wrappers.default
 *   });
 * </pre>
 *
 * ## Config
 *  - `uri`: socket.io server URL. If this param is not specified sockets.io will connect to the application host.
 *  - `token`: every server request will be signed with this token.
 *  - `separator`: in which way socket event will be splatted. Socket event looks in this way:
 *    `prefix` + `endPoint` + `separator` + `method`
 *  - `prefix`: will be added to each server request.
 *  - `defaultParser`: function that will parse server response if such function is not specified in the concrete method.
 *    From a box there are 2 parsers you may use:
 *      * `IOREST.parsers.default` which return `result` field of the response
 *      * `IOREST.parsers.proxy` that does nothing and passes server response as it is.
 *  - `defaultWrapper`: function that will wrapp each server request if such function is not specified in the concrete method.
 *    From a box there are 2 wrapper you may use:
 *      * `IOREST.wrapper.default` which wraps model to the `data` field and `token`.
 *      * `IOREST.wrappers.proxy` that does nothing and passes server request as it is.
 *
 * Of course you can pass your own function instead of wrapper or parser. Both functions have the same signature:
 * <pre>function (data) {return data.field;}</pre>
 *
 * ## Usage
 * Pass the IOREST provider into your code and create a transport. Transport is an instance of IOREST_Transport:
 *
 * <pre>
 *   var Unit = IOREST.createService('Unit');
 * </pre>
 *
 * But more prefer way to do this is to create transport as separated service and use
 * it all over the app in a common way using Angular DI:
 * <pre>
 *  angular.module('app')
 *   .factory('Unit', function (IOREST) {
 *     return IOREST.createService('Unit', {
 *       getAll: {
 *         action: 'getList'
 *       }
 *     });
 *   });
 * </pre>
 *
 * First param is called `endpoint` and should contain only alphabet symbols and numbers. `endpoint` will be lowercased.
 * Second param is map of functions, in other words `methods` that will be attached to this transport.
 * <pre>
 *   getPublished: {
 *       action: 'getPublished',
 *       parse: function (response) {
 *         return response.result;
 *       },
 *       wrap: function (model) {
 *         return {data: model};
 *       }
 *     },
 *     ...
 * </pre>
 *
 * If you will not specify `parse` and `wrap` functions it will be set form default values.
 *
 * Each method returns a promise that will be resolved after the server successfully responses or
 * rejected in case response contains `error` field with some data (not null or undefined or false).
 *
 * <pre>
 *   Unit.getAll({id: 'DdfguDFD35456456'})
 *    .then(function (units) {
 *      $scope.units = units;
 *      $scope.$apply();
 *    })
 *    .catch(function(error) {
 *      throw new Error('Ups! Here is some error happened: ' + error.message);
 *    });
 * </pre>
 *
 * Each specified method will be added to the list of default methods which has each transport. Here is
 * list of these methods:
 *
 *  - `get`
 *  - `create`
 *  - `edit`
 *  - `remove`
 */
angular.module('services.examinerTransport', ['ngLodash']);

angular.module('services.examinerTransport')
  .provider('IOREST', function(lodash) {
    var _, $q, _config, socket, parsers, wrappers, pendingRequests, $log;

    // Alias for the lodash lib.
    _ = lodash;

    /**
     * @description
     * Default parse methods for all responses. Might be override.
     * @param {Object|Array} response Row response from the server
     * @returns {*}
     */
    parsers = {
      'default': function(response) {
        return response.result;
      },
      proxy: function(response) {
        return response;
      }
    };

    /**
     * @description
     * Wraps the model to the object with `token` and `data` props. Or does nothing.
     * @param {Object} model Data object to be wrapped
     * @returns {Object} Wrapped data object
     * @private
     */
    wrappers = {
      'default': function(model) {
        return {
          token: _config.token,
          data: model
        };
      },
      filter: function(model) {
        return {
          token: _config.token,
          filter: model
        };
      },
      proxy: function(model) {
        return model;
      }
    };

    // Service config.
    _config = {
      uri: null,
      token: '',
      separator: ':',
      prefix: '',
      defaultParser: parsers.default,
      defaultWrapper: wrappers.default
    };

    // Default methods. Might be override by the transport config.
    // Each method might be specified by the `parse` and `wrap` methods.
    // Be default it uses default methods from the config.
    var _defaultMethods = {
      /**
       * @ngdoc method
       * @name services.examinerTransport.IOREST_Transport#get
       * @methodOf services.examinerTransport.IOREST_Transport
       * @description
       * Get the model from the server.
       *
       * @param {object} options Options or model, whatever to specify the request.
       * @returns {Promise} promise for `get` operation
       */
      get: {
        action: 'get'
      },

      /**
       * @ngdoc method
       * @name services.examinerTransport.IOREST_Transport#edit
       * @methodOf services.examinerTransport.IOREST_Transport
       * @description
       * Edits the model on the server and returns updated entity model.
       *
       * @param {object} options Options or model, whatever to specify the request.
       * @returns {Promise} promise for `edit` operation
       */
      edit: {
        action: 'edit'
      },

      /**
       * @ngdoc method
       * @name services.examinerTransport.IOREST_Transport#create
       * @methodOf services.examinerTransport.IOREST_Transport
       * @description
       * Creates a new model on the server and returns created entity model.
       *
       * @param {object} options Options or model, whatever to specify the request.
       * @returns {Promise} promise for `create` operation
       */
      create: {
        action: 'create'
      },

      /**
       * @ngdoc method
       * @name services.examinerTransport.IOREST_Transport#remove
       * @methodOf services.examinerTransport.IOREST_Transport
       * @description
       * Removes a model on the server and returns status.
       *
       * @param {object} options Options or model, whatever to specify the request.
       * @returns {Promise} promise for `remove` operation
       */
      remove: {
        action: 'remove'
      }
    };

    // Init pending request by empty array.
    // It will track requests adding and removing objects to this array.
    pendingRequests = [];

    // Check whether the socket.io is defined
    if (typeof io === 'undefined') {
      throw new Error('IOREST can\'t work without socket.io included.');
    }

    /**
     * @ngdoc service
     * @name services.examinerTransport.IOREST_Transport
     * @description
     * # IOREST_Transport
     * Socket transport that will do all the work with sockets. Each instance of IOREST_Transport contains a bunch of
     * methods to communicate with the server. You are able to add any other methods. See [IOREST](api/services.examinerTransport.IOREST) doc for more details.
     *
     * @param {string} endpoint Socket event endpoint that goes after the prefix and before method.
     * @param {object} methods Methods of this transport.
     * @constructor
     */
    var IOREST_Transport = function(endpoint, methods) {
      // Check whether the endpoint is specified correctly.
      if (!_.isString(endpoint)) {
        throw new Error('Endpoint should be specified and should be a string.');
      }
      if ((/(?=[^a-z0-9])/i).test(endpoint)) {
        throw new Error('Endpoint should contain only alphabetical chars and digits.');
      }

      // Setting endpoint in lowercase.
      this._endpoint = endpoint.toLowerCase();

      // Add all specified methods to the instance.
      this._provideAPI(methods);
    };

    /**
     * Prototype methods and props.
     */
    IOREST_Transport.prototype = {
      constructor: IOREST_Transport,

      /**
       * @description
       * Socket message endpoint.
       * Result event will look like this `endpoint:get`
       * @private
       * @property
       * @type {String}
       */
      _endpoint: null,

      /**
       * @ngdoc method
       * @name services.examinerTransport.IOREST_Transport#getEndpoint
       * @methodOf services.examinerTransport.IOREST_Transport
       * @description
       * Getter for the endpoint.
       *
       * @returns {String} endpoint
       */
      getEndpoint: function() {
        return this._endpoint;
      },

      /**
       * @name services.examinerTransport.IOREST_Transport#_compile
       * @methodOf services.examinerTransport.IOREST_Transport
       * @description
       * Compiles the event name is this ways: `prefix + endpoint + separator + method`
       *
       * @param {string} action Method name
       * @returns {string} whole event
       * @private
       */
      _compile: function(action) {
        return _config.prefix + [this.getEndpoint(), action].join(_config.separator);
      },

      /**
       * @name services.examinerTransport.IOREST_Transport#_provideAPI
       * @methodOf services.examinerTransport.IOREST_Transport
       * @description
       * Add all the specified methods into the transport itself (or use default one).
       * Every method return a `promise`, that will be resolved with a server data or rejected
       * with an error.
       *
       * @param {Object} methods Map of functions
       * @private
       */
      _provideAPI: function(methods) {
        // Merge methods deeply.
        methods = _.merge({}, _defaultMethods, methods || {});
        // Create transport methods.
        _(methods).forOwn(function(method, key) {

          // Each method can accept model that will be sent to the server.
          // For example, if we want to update a model, we need to add
          // at least `id` param.
          this[key] = function(model) {
            var def, eventName, parse, wrap, fakeEventToLog;

            def = $q.defer();
            eventName = this._compile(method.action);

            // Add default parse and wrap methods in case that were not specified.
            parse = method.parse || _config.defaultParser;
            wrap = method.wrap || _config.defaultWrapper;

            // Wrap the model
            model = wrap(model);

            // Add pending request.
            fakeEventToLog = {
              event: eventName,
              data: model,
              date: new Date()
            };
            pendingRequests.push(fakeEventToLog);

            // Logging request.
            $log.debug(eventName + ' -> ' + JSON.stringify(model, null, 2));

            // Make emmit call. We use here third param as callback.
            // @see http://stackoverflow.com/questions/20337832/is-socket-io-emit-callback-appropriate
            socket.emit(eventName, model, function(response) {
              // Logging response.
              $log.debug(eventName + ' <- ' + JSON.stringify(response, null, 2));
              // Reject promise in case that response contains `error` field.
              if (!!response.error) {
                def.reject({
                  action: {
                    event: eventName,
                    model: model
                  },
                  message: response.error
                });
              } else {
                def.resolve(parse(response));
              }
              // Remove pending request
              _(pendingRequests).pull(fakeEventToLog);
            });

            return def.promise;
          }.bind(this);
        }, this);
      }
    };

    /**
     * In this case we have to create separated namespace cause we need an ability
     * to set the config in runtime but not only during the configuration phase.
     *
     */
    var IOREST_API = {

      /**
       * @ngdoc method
       * @name services.examinerTransport.IOREST#setConfig
       * @methodOf services.examinerTransport.IOREST
       * @description
       * Sets the global IOREST config.
       *
       * @static
       * @param {object} config Configuration object.
       */
      setConfig: function(config) {
        _.merge(_config, config);
      },

      /**
       * @ngdoc method
       * @name services.examinerTransport.IOREST#getConfig
       * @methodOf services.examinerTransport.IOREST
       * @description
       * Gets the global config.
       *
       * @static
       * @return {object} a copy of config.
       */
      getConfig: function() {
        return _.cloneDeep(_config);
      },

      /**
       * @ngdoc method
       * @name services.examinerTransport.IOREST#createService
       * @methodOf services.examinerTransport.IOREST
       * @description
       * Fabric method that will create new IOREST_Transport transport with the specified endpoint and methods.
       * @see IOREST_Transport
       * @param {string} endpoint Name of the server model or collection.
       * @param {object} methods Map of methods.
       * @returns {IOREST_Transport} an instance of IOREST_tranposrt with appropiate methods.
       */
      createService: function(endpoint, methods) {
        return new IOREST_Transport(endpoint, methods);
      },

      /**
       * @ngdoc method
       * @name services.examinerTransport.IOREST#connect
       * @methodOf services.examinerTransport.IOREST
       * @description
       * Establishes connection to the socket server. This method should be called in the `config` or `run` phase of
       * application. In other case instances of `IOREST_Transport` won't work on event won't be create in correct way.
       */
      connect: function() {
        // Connect to the server. Works only during the configuration phase.

        if (_.isNull(_config.uri)) {
          // by default
          socket = window.io('', _config.opts || {});
        } else {
          // or by specified uri.
          socket = window.io(_config.uri, _config.opts || {});
        }

        socket.emit('interview:setup', {}, function() {

        });

      },

      /**
       * @ngdoc property
       * @propertyOf services.examinerTransport.IOREST
       * @name services.examinerTransport.IOREST#parsers
       * @description
       * Several parsers from a box if you don't need to create your own.
       * @returns {object.<functions>} map of functions-parsers
       */
      parsers: parsers,

      /**
       * @ngdoc property
       * @propertyOf services.examinerTransport.IOREST
       * @name services.examinerTransport.IOREST#wrappers
       * @description
       * Several wrappers from a box if you don't need to create your own.
       * @returns {object.<function>} map of functions-wrappers
       */
      wrappers: wrappers,

      /**
       * @ngdoc property
       * @propertyOf services.examinerTransport.IOREST
       * @name services.examinerTransport.IOREST#pendingRequests
       * @description
       * The list of requests to the server which are not being responded yet.
       * @returns {array.<object>} list of requests info.
       */
      pendingRequests: pendingRequests
    };

    // Public API for configuration phase.
    this.setConfig = IOREST_API.setConfig;
    this.connect = IOREST_API.connect;
    this.parsers = parsers;
    this.wrappers = wrappers;
    this.pendingRequests = pendingRequests;

    // Method for instantiating. In our case we are just returning service itself.
    this.$get = ['$q', '$log', function(_$q_, _$log_) {
      $q = _$q_;
      $log = _$log_;

      IOREST_API.socket = socket;
      return IOREST_API;
    }];
  });

