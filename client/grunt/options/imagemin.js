module.exports = function() {
  'use strict';
  return {
    dist: {
      files: [{
        expand: true,
        cwd: '<%= app.src %>/images',
        src: '{,*/}*.{png,jpg,jpeg,gif}',
        dest: '<%= app.dist %>/images'
      }]
    }
  };
};
