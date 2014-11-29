module.exports = function() {
  'use strict';

  return {
    options: {
      nospawn: true,
      livereload: true
    },
    less: {
      files: ['<%= app.src %>/styles/{,*/}*.less'],
      tasks: ['less:dev', 'autoprefixer:dev']
    },
    html: {
      files: ['<%= app.src %>/{,*/}*.{html,tpl}']
    },
    js: {
      files: ['<%= app.src %>/{,*/}*.js']
    }
  };
};
