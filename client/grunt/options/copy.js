module.exports = function(grunt) {
  'use strict';
  return {
    tmp: {
      files: [
        {
          expand: true,
          src: ['**/*.html'],
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
          dot: true,
          cwd: '<%= app.src %>',
          dest: '<%= app.dist %>',
          src: [
            '<%= app.src %>/images/*.{ico,png}',
            '<%= app.src %>/fonts/**'
          ]
        }
      ]
    }
  };
};
