module.exports = function() {
  'use strict';
  return {
    dist: {
      options: {
        collapseWhitespace: true
        //collapseBooleanAttributes: true,
        //removeCommentsFromCDATA: true,
        //removeOptionalTags: true
      },
      files: [{
        expand: true,
        cwd: '<%= app.dist %>',
        src: ['{,*/}*.html'],
        dest: '<%= app.dist %>'
      }]
    }
  };
};
