/*
 * grunt-ng-html-snapshot
 * https://github.com/JasonRammoray/grunt-ng-html-snapshot
 *
 * Copyright (c) 2016 JasonRammoray
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.task.registerMultiTask('ng_html_snapshot', function() {
    var phantom = require('phantomjs');

    var childProcess = require('child_process');

    var options = this.options();

    // Default parameters

    options.pageLoadingTimeout = options.pageLoadingTimeout || 100;

    options.pageDocType = options.pageDocType || '<!doctype html>';

    options.jobPath = options.jobPath || './node_modules/grunt-ng-html-snapshot/utils/phantom-job.js';

    options.removeMetaFragment =  options.removeMetaFragment === undefined ? true : !!options.removeMetaFragment;

    childProcess.execFileSync(
      phantom.path,

      [options.jobPath, JSON.stringify(options)],

      {
        timeout: 300000
      }
    );
  });
};