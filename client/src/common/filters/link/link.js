'use strict';

angular.module('interviewer')
  .filter('link', function(lodash) {
    return function(text) {
      var regexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
      return text.replace(regexp, '<a href="$0">$0</a>');
    };
  });
