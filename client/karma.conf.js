// Karma configuration
// Generated on Sat Nov 29 2014 14:02:13 GMT+0200 (FLE Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/bower_components/angular/angular.js',
      'src/bower_components/angular-mocks/angular-mocks.js',
      'src/bower_components/angular-animate/angular-animate.js',
      'src/bower_components/angular-cookies/angular-cookies.js',
      'src/bower_components/angular-sanitize/angular-sanitize.js',
      'src/bower_components/angular-touch/angular-touch.js',
      'src/bower_components/angular-ui-ace/ui-ace.js',
      'src/bower_components/ace-builds/src-noconflict/ace.js',
      'src/bower_components/angular-ui-router/release/angular-ui-router.js',
      'src/bower_components/ng-lodash/build/ng-lodash.js',
      'src/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'src/bower_components/angular-notify-toaster/toaster.js',
      'src/bower_components/angular-aria/angular-aria.js',
      'src/bower_components/hammerjs/hammer.js',

      'src/bower_components/angular-material/angular-material.js',
      'src/bower_components/zeroclipboard/dist/ZeroClipboard.js',
      'src/bower_components/ng-clip/src/ngClip.js',
      'src/bower_components/angular-ui-sortable/sortable.js',
      'src/*.js',
      'src/common/**/*.js',
      'src/components/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
