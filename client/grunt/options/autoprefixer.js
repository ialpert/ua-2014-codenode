module.exports = function() {
  'use strict';
  return {
    options: {
      browsers: ['last 2 version']
    },
    dev: {
      src: '<%= app.src %>/css/main.css'
    }
  };
};
