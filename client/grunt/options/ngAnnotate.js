module.exports = function() {
  'use strict';
  return {
    dist: {
      files: [{
        expand: true,
        src: '<%= app.tmp %>/concat/js/*.js'
      }]
    }
  };
};
