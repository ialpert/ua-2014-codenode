module.exports = function() {
  'use strict';
  return {
    html: [
      '<%= app.dist %>/{,*/}*.html'
    ]
  };
};
