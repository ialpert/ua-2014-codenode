'use strict';

angular.module('interviewer')
  .directive('whiteBoard', function (AppState) {

    var paper, project, view;

    paper = window.paper;
    project = window.project;
    view = window.view;

    return {
      restrict:'AEC',
      templateUrl: 'components/whiteBoard/whiteBoard.html',
      controller: function($scope) {

      },
      link: function(scope, element, attrs) {

      }
    };
  });
