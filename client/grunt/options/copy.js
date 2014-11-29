module.exports = function(grunt) {
  'use strict';
  return {
    tmp: {
      files: [
        {
          expand: true,
          src: ['common/**/*.html', 'components/**/*.html', '*.html'],
          dest: '<%= app.dist %>/',
          cwd: '<%= app.src %>/'
        }
      ],
      options: {
        'process': function(content) {
          return grunt.template.process(content);
        }
      }
    },
    dist: {
      files: [
        {
          expand: true,
          cwd: '<%= app.src %>',
          dest: '<%= app.dist %>',
          src: [
            'fonts/**'
          ]
        }
      ]
    }
  };
};
