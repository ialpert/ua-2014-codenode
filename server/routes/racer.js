'use strict';

module.exports = function(store) {
  return {
    bundle: function(req, res) {

      res.setHeader('Cache-Control', 'no-store');

      store.bundle(__dirname + '/racer.js', function(err, js) {
        res.type('js');
        res.send(js);
      });
    }
  };
};


