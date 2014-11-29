module.exports = function() {
  'use strict';
  return {
    dev: {
      options: {
        compress: false,
        yuicompress: false,
        optimization: 0
      },
      files: [{
        expand: true,
        cwd: '<%= app.src %>/styles/',
        src: ['main.less'],
        dest: '<%= app.src %>/css/',
        ext: '.css'
      }]
    }
  };
};
