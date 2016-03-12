# grunt-ng-html-snapshot

> A simple phantom.js based snapshots creator for single page applications written in Angular 1.x.
*DO NOT* use it for regular website (whose front-end works not in Angular 1.x) with default phantom.js job.
In case if you *DO* want to use it for regular website you have to set path to phantom.js job (see details bellow).

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ng-html-snapshot --save
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ng-html-snapshot');
```

## The "ng_html_snapshot" task

### Overview
In your project's Gruntfile, add a section named `ng_html_snapshot` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ng_html_snapshot: {
    options: {
      // Task-specific options go here.
    }
  }
});
```

### Options

#### options.baseUrl
Type: `String`

Base url of your application / website in form of: protocol://host. Make sure that your web server is up and running if you running web application locally.
For example, http://localhost:8080

#### options.jobPath
Type: `String`
Default: './node_modules/grunt-ng-html-snapshot/utils/phantom-job.js'

Path to a phantom.js job (relatively to Gruntfile.js) which contains logic for building web pages snapshots. Change it only if you need custom phantom.js logic and you know what you are doing. 

#### options.output
Type: `Object`

An object with output details

### options.output.dir
Type: `String`

Output directory relative to Gruntfile.js

### options.output.snapshotFileExt
Type: `String`

Snapshot file extension. If you would like to output each page snapshot without file extension, then either pass false or omit this param.

### options.output.logFile
Type: `String`

Path to log file with a results of phantom.js actions. If you don't need such a log, then either pass false or omit this param.

### options.pageLoadingTimeout
Type: `Number`
Default: 100

If page wasn't successfully loaded during first attempt, then timeout is used as an interval before executing next attempt.

### options.pageDocType
Type: `String`
Default: '<!doctype html>'

Document type (for example, '<!doctype html>', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">', etc). 

### options.pages
Type: `Array`

Array of target pages. Each object in this array has to have two fields: path and file.
'path' is added to baseUrl (options.output.baseUrl) in order to construct page's absolute url.
'file' is added to output directory path (options.output.dir) and result is merged with file extension (only if it was set) in order to get an absolute path to a file with page snapshot.

### Usage Example

```js
grunt.initConfig({
    ng_html_snapshot: {
        options: {
            /*
             * Keep in mind, that you have to have a running web server, if you running
             * your web application locally.
             */

            baseUrl: 'http://localhost:8080',

            output: {
              // Output directory. In case if doesn't exists phantom creates it.

              dir: './html-snapshots',

              snapshotFileExt: 'html',

              // If you don't want to log job actions, then use false as a value.

              logFile: 'job-log.txt'
            },

            // Page loading timeout in ms. Default value - 100 ms.

            pageLoadingTimeout: 100,

            pageDocType: '<!doctype html>',

            pages: [
              {
                path: '/path-to-page-a',

                file: 'page-a'
              },

              {
                path: '/',

                file: 'main-page'
              },

              {
                path: '/path-to-page-b',

                file: 'page-b'
              }
            ]
        }
    }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Release History
0.1.0 - first version. No threshold for checks for page loading status. The process will be killed by timeout after 5 minutes.