'use strict';

angular.module('interviewer')
  .directive('whiteBoard', function (AppState) {

    var paper, project, view;

    paper = window.paper;
    project = window.project;
    view = window.view;

    return {
      restrict: 'AEC',
      templateUrl: 'components/whiteBoard/whiteBoard.html',
      link: function ($scope, $element) {

        var wrapperBox = $($element).find('.board-holder'),
          ctx = wrapperBox.find('canvas')[0].getContext("2d"),
          path,
          drag = false;

        //Set size for canvas
        ctx.canvas.width = wrapperBox.width() - 40;
        ctx.canvas.height = $scope.canvasHeight;

        $scope.canvasHeight = 400;
        $scope.colors = {
          red: '#d32f2f',
          pink: '#c2185b',
          purple: '#9c27b0',
          deeppurple: '#673ab7',
          indigo: '#3f51b5',
          blue: '#0277bd',
          lightblue: '#03a9f4',
          cyan: '#00bcd4',
          teal: '#009688',
          green: '#4caf50',
          lightgreen: '#8bc34a',
          lime: '#cddc39',
          yellow: '#ffea00',
          orange: '#ff9100',
          brown: '#795548',
          grey: '#9e9e9e',
          black: '#000'
        };
        $scope.selectedIndex = 0;
        $scope.data = null;
        $scope.currentColor = 'black';
        $scope.stroksWidth = [
          {name: 'min', size: 3},
          {name: 'mid', size: 8},
          {name: 'max', size: 12}
        ];
        $scope.strokeWidth = $scope.stroksWidth[0].size;
        $scope.ERASER_COLOR = '#fff';

        /**
         * Clear data from project
         */
        $scope.clearData = function () {
          project.clear();
          view.update();
        };

        /**
         * Get data from project
         * JSON returned
         * @returns {*}
         */
        $scope.getWhiteBoardData = function () {
          return project.exportJSON();
        };

        /**
         * Set data for project
         * Update view
         */
        $scope.setWhiteBoardData = function (data) {
          project.importJSON(data);
          view.update();
        };

        /**
         * Set current color value
         * @param colorValue
         * @param $index
         */
        $scope.setCurrentColor = function (colorValue, $index) {
          $scope.selectedIndex = $index;
          $scope.currentColor = colorValue;
        };

        /**
         * Active eraser. Set current color.
         */
        $scope.eraserActive = function () {
          $scope.currentColor = $scope.ERASER_COLOR;
        };

        /**
         * Handling events on mouse up and touch end
         * Clear Mouse Drag Flag
         */
        function mouseUp() {
          drag = false;
        }

        /**
         * Handling events on mouse move and touch move
         * Add points
         * @param event
         */
        function mouseDrag(event) {
          if (drag) {
            drawPath(event.originalEvent.layerX, event.originalEvent.layerY);
          }
        }

        /**
         * Handling events on mouse move and touch move
         * Enter path set color and width for current path element
         * @param event
         */
        function mouseDown(event) {
          //Set flag to detect mouse drag
          drag = true;
          path = new paper.Path();

          path.strokeColor = $scope.currentColor;
          path.strokeWidth = $scope.strokeWidth;
          path.smooth();

          drawPath(event.originalEvent.layerX, event.originalEvent.layerY);
          drawPoint(event.originalEvent.layerX, event.originalEvent.layerY);
        }

        /**
         * Drawing line
         * @param x
         * @param y
         */
        function drawPath(x, y) {
          path.add(new paper.Point(x, y));
        }

        /**
         * Drawing point - circle
         * @param x
         * @param y
         */
        function drawPoint(x, y) {
          var myCircle = new paper.Path.Circle({
            center: {
              x: x,
              y: y
            },
            radius: ($scope.strokeWidth - 1)
          });
          myCircle.strokeColor = $scope.currentColor;
          myCircle.fillColor = $scope.currentColor;
        }

        /**
         * Component init
         */
        function initPaper() {
          paper.install(window);
          paper.setup('canvas');
        }

        $element.bind('mousedown', function (event) {
          if (event.srcElement.id === 'canvas') {
            mouseDown(event);
          }
        });

        $element.bind('mousemove', function (event) {
          if (event.srcElement.id === 'canvas') {
            mouseDrag(event);
          }
        });

        $element.on('mouseup', mouseUp);

        initPaper();
      }
    };
  });
