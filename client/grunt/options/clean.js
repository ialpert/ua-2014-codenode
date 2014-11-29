module.exports = function() {
  'use strict';
  return {
    dist: '<%= app.dist %>',
    css: '<%= app.src %>/css',
    tmp: '<%= app.tmp %>'
  };
};
