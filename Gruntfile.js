/*
 * grunt-ng-html-snapshot
 * https://github.com/jasonrammoray/grunt-ng-html-snapshot
 *
 * Copyright (c) 2016 JasonRammoray
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      tests: ['tmp']
    },

    ng_html_snapshot: {
      options: {
        // Keep in mind, that you have to have a running web server, which serves content at baseUrl

        baseUrl: 'https://docs.angularjs.org',

        jobPath: 'utils/phantom-job.js',

        output: {
          dir: './tmp'
        },

        // Page loading timeout in ms. Default - 100 ms

        pageLoadingTimeout: 100,

        pageDocType: '<!doctype html>',

        pages: [
          {
            path: '/guide',

            file: 'guide'
          },

          {
            path: '/misc/contribute',

            file: 'misc-contribute'
          }
        ]
      },

      withExtAndWithLog: {
        options: {
          output: {
            snapshotFileExt: 'html',

            logFile: 'job-log.log',

            dir: './tmp'
          }
        }
      },

      withoutExtAndWithoutLog: {
        options: {
          output: {
            snapshotFileExt: false,

            logFile: false,

            dir: './tmp'
          }
        }
      },

      withRemovingMetaFragment: {
        options: {
          output: {
            snapshotFileExt: 'html',

            logFile: false,

            dir: './tmp'
          }
        }
      },

      withoutRemovingMetaFragment: {
        options: {
          removeMetaFragment: false,

          output: {
            snapshotFileExt: 'html',

            logFile: false,

            dir: './tmp'
          }
        }
      }
    },

    nodeunit: {
      options: {
        reporter: 'junit',
        reporterOptions: {
          output: 'test/report'
        }
      },

      withFileExtAndLog: {
        src: ['test/specs/test-for-files-with-ext-and-log-specs.js'],

        options: {
          reporter: 'junit',
          reporterOptions: {
            output: 'test/report'
          }
        }
      },

      withoutFileExtAndWithoutLog: {
        src: ['test/specs/test-for-files-without-ext-and-without-log-specs.js']
      },

      withRemovingMetaFragment: {
        src: ['test/specs/test-for-files-with-removing-meta-fragment-spec.js']
      },

      withoutRemovingMetaFragment: {
        src: ['test/specs/test-for-files-without-removing-meta-fragment-spec.js']
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('testFilesWithExtensionAndWithLog', [
    'clean',

    'ng_html_snapshot:withExtAndWithLog',

    'nodeunit:withFileExtAndLog'
  ]);

  grunt.registerTask('testFilesWithoutExtensionAndWithoutLog', [
    'clean',

    'ng_html_snapshot:withoutExtAndWithoutLog',

    'nodeunit:withoutFileExtAndWithoutLog'
  ]);

  grunt.registerTask('testFilesWithRemovingMetaFragment', [
    'clean',

    'ng_html_snapshot:withRemovingMetaFragment',

    'nodeunit:withRemovingMetaFragment'
  ]);

  grunt.registerTask('testFilesWithoutRemovingMetaFragment', [
    'clean',

    'ng_html_snapshot:withoutRemovingMetaFragment',

    'nodeunit:withoutRemovingMetaFragment'
  ]);

  grunt.registerTask('test', [
    'testFilesWithoutExtensionAndWithoutLog',

    'testFilesWithExtensionAndWithLog'
  ]);

  grunt.registerTask('default', ['test']);
};