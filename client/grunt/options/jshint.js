module.exports = function() {
  'use strict';
  return {
    options: {
      jshintrc: './../.jshintrc',
      reporter: require('jshint-stylish'),
      force: true
    },
    env: {
      src: ['Gruntfile.js', 'grunt/**']
    },
    app: {
      src: ['<%= app.src %>/{,*/}*.js']
    }
  };
};
