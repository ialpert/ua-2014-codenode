module.exports = function() {
  'use strict';
  return {
    html: [
      '<%= app.src %>/{,*/}*.html'
    ],
    css: [
      '<%= app.src %>/css/main.css'
    ],
    options: {
      dest: '<%= app.dist %>',
      root: '<%= app.src %>'
    }
  };
};
