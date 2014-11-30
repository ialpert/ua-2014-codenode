'use strict';

angular.module('interviewer')
  .filter('link', function(lodash) {
    return function(text) {
      var regexp = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,6})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/im;
      return text.replace(regexp, '<a href="$1" target="_blank">$1</a>');
    };
  });
