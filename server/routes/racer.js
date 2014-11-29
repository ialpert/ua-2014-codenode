'use strict';

module.exports = function(store) {

  var path = require('path');

  return {
    bundle: function(req, res) {

      res.setHeader('Cache-Control', 'no-store');

      store.bundle(path.resolve(__dirname + '/../racer.js'), function(err, js) {
        res.type('js');
        res.send(js);
      });
    }
  };
};


