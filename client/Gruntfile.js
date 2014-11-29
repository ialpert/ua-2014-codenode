module.exports = function(grunt) {
  'use strict';

  var lodash = require('lodash'),
      matchDep = require('matchdep'),
      path = require('path');

  var tasks = [],
      config = {
        pkg: grunt.file.readJSON('./../package.json'),
        app: {
          src: 'src',
          dist: 'build',
          tmp: '.tmp',
          port: '3000'
        }
      };

  /**
   * show elapsed time at the end
   */
  require('time-grunt')(grunt);

  /**
   * Load available tasks options
   */
  grunt.file.expand(['grunt/options/*.js']).forEach(function(filePath) {
    var name = path.basename(filePath, '.js');
    config[name] = config[name] || {};
    lodash.merge(config[name], require('./' + filePath)(grunt, config));
  });

  grunt.initConfig(config);

  /**
   * Load all tasks specified in package.json
   */

  var cwd = process.cwd();
  process.chdir(__dirname + '/../');

  tasks.concat(matchDep.filterDev('grunt-*')).forEach(grunt.loadNpmTasks);
  process.chdir(cwd);

  /**
   * Load custom tasks
   */
  grunt.file.expand(['grunt/*.js']).forEach(function(filePath) {
    require('./' + filePath)(grunt);
  });

  grunt.registerTask('test', [
    'jshint'
  ]);

  grunt.registerTask('dev', [
    'less:dev',
    'autoprefixer:dev',
    'open',
    'watch'
  ]);
};
