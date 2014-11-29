angular.module('interviewer')
  .controller('MainCtrl', function (toaster) {
    toaster.pop('success', 'Welcome to Interviewer!');
  });
