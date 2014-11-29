var io = {
  connect: createMockSocketObject
};

function createMockSocketObject (uri) {

  var socket = {
    uri: uri,
    on: function (ev, fn) {
      (this._listeners[ev] = this._listeners[ev] || []).push(fn);
    },
    once: function (ev, fn) {
      (this._listeners[ev] = this._listeners[ev] || []).push(fn);
      fn._once = true;
    },
    emit: function (ev, data, callback) {
        if (this._listeners[ev]) {
        this._listeners[ev].forEach(function (listener) {
          if (listener._once) {
            this.removeListener(ev, listener);
          }
          listener(data, callback);
        }.bind(this));
      }
    },
    _listeners: {},
    removeListener: function (ev, fn) {
      if (fn) {
        var index = this._listeners[ev].indexOf(fn);
        if (index > -1) {
          this._listeners[ev].splice(index, 1);
        }
      } else {
        delete this._listeners[ev];
      }
    },
    removeAllListeners: function (ev) {
      if (ev) {
        delete this._listeners[ev];
      } else {
        this._listeners = {};
      }
    },
    disconnect: function () {}
  };

  return socket;
}
