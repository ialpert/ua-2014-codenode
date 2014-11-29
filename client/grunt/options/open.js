module.exports = function() {
  'use strict';
  return {
    server: {
      path: 'http://localhost:<%= app.port %>'
    }
  };
};
