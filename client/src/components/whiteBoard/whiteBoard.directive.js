'use strict';

angular.module('interviewer')
  .directive('whiteBoard', function () {

    var paper = window.paper;

    return {
      restrict: 'AEC',
      templateUrl: 'components/whiteBoard/whiteBoard.html',

      link: function ($scope, $element) {
        var paperObj = new paper.PaperScope(),
          wrapperBox = $($element).find('.board-holder'),
          ctx = wrapperBox.find('canvas')[0].getContext("2d"),
          path,
          drag = false;

        $scope.canvasHeight = 400;

        //Set size for canvas
        ctx.canvas.width = wrapperBox.width() - 40;
        ctx.canvas.height = $scope.canvasHeight;

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
          black: '#000',
          white: '#fff'
        };
        $scope.selectedIndex = 0;
        $scope.data = null;
        $scope.currentColor = 'black';
        $scope.stroksWidth = [
          {name: 'thin', size: '3'},
          {name: 'medium', size: '8'},
          {name: 'bold', size: '12'}
        ];

        $scope.strokeWidth = $scope.stroksWidth[0].size;
        $scope.ERASER_COLOR = '#fff';

        /**
         * Clear data from project
         */
        $scope.clearData = function () {
          paperObj.project.clear();
          paperObj.view.update();
        };

        /**
         * Get data from project
         * JSON returned
         * @returns {*}
         */
        $scope.getWhiteBoardData = function () {
          return paperObj.project.exportJSON();
        };

        /**
         * Set data for project
         * Update view
         */
        $scope.setWhiteBoardData = function (data) {
          paperObj.project.importJSON(data);
          paperObj.view.update();
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
          path = new paperObj.Path();

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
          path.add(new paperObj.Point(x, y));
        }

        /**
         * Drawing point - circle
         * @param x
         * @param y
         */
        function drawPoint(x, y) {
          var myCircle = new paperObj.Path.Circle({
            center: {
              x: x,
              y: y
            },
            radius: ($scope.strokeWidth/2)
          });
          myCircle.strokeColor = $scope.currentColor;
          myCircle.fillColor = $scope.currentColor;
        }

        /**
         * Component init
         */
        function initPaper() {
          // paperObj.install($scope);
          paperObj.setup('canvas');
        }

        $element.bind('mousedown touchstart', function (event) {
          if (event.originalEvent.srcElement.id === 'canvas') {
            mouseDown(event);
          }
        });

        $element.bind('mousemove touchmove', function (event) {
          if (event.originalEvent.srcElement.id === 'canvas') {
            mouseDrag(event);
          }
        });

        $element.on('mouseup touchend', mouseUp);

        initPaper();
      }
    };
  });
