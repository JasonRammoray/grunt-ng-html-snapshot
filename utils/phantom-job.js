/*
 * @author JasonRammoray
 * @email jason.rammoray@gmail.com
 */

(function () {
	'use strict';

	var WebPage = require('webpage');

	var args = require('system').args;

	var fs = require('fs');

	/*
	 * args in this case consists of two arguments:
	 * [0] - path to phantom job (this file)
	 * [1] - job parameters serialized as json
	 */

	try {
		var jobParams = JSON.parse(args[1]);
	} catch (error) {
		console.log('Params passed to phantom job can not be parsed as json. Exiting...');

		phantom.exit();
	}

	var websitePages = jobParams.pages;

	var pageLoadingTimeout = jobParams.pageLoadingTimeout;

	var utils = {
		log: {
			/**
			 * Returns reference to log object.
			 */

			get: (function () {
				var log = [];

				return function () {
					return log;
				};
			})(),

			/**
			 * Adds message to the log object and logs it to the console.
			 * @param {*} message - message data
			 */

			add: function (message) {
				this.get().push(message);

				console.log(message);
			},

			/**
			 * Erases the log.
			 */

			reset: function () {
				this.get().splice(0)
			},

			/**
			 * Saves log only if path to the log file can be converted to boolean true.
			 */

			save: function (logFile) {
				if (!!logFile) {
					fs.write(jobParams.output.dir + '/' + jobParams.output.logFile, this.get().join('\n'), {
						mode: 'w',

						charset: 'utf-8'
					});
				} else {
					console.log('Skipping saving a log file. Check log file name.');
				}
			}
		}
	};

	/**
	 * Loads pages and stores their html snapshots.
	 * Algorithm:
	 * a) check if there is still pages to process;
	 * b) if there is no one, then exit;
	 * c) fetch page from list and load it in headless browser;
	 * d) if there is no pending http requests, then store page snapshot in a file and load next page (go to step a);
	 * e) otherwise wait pageLoadingTimeout ms and repeat step d.
	 * @param {Array} websitePages - pages list, that should be processed
	 */

	function loadPages (websitePages) {
		if (!websitePages.length) {
			utils.log.add('Job for building html snapshots is done. Exiting...');

			utils.log.save(jobParams.output.logFile);

			phantom.exit();
		}

		var websitePage = websitePages.shift();

		var pageObj = WebPage.create();

		var websitePageUrl = jobParams.baseUrl + websitePage.path;

		var websitePageOutputFile = jobParams.output.dir +

			'/' +

			websitePage.file +

			(!!jobParams.output.snapshotFileExt ? '.' + jobParams.output.snapshotFileExt : '');

		pageObj.onLoadFinished = function () {
			utils.log.add('Page ' + websitePageUrl + ' load is finished');

			var pageHtml = jobParams.pageDocType;

			/**
			 * Checks if page is loaded.
			 * If so, then stores it's content to a file and the proceeds to the next page,
			 * otherwise sets timeout for checking page loading status.
			 */

			var loadPageHtml = function pageLoader () {
				utils.log.add('Checking if page "' + websitePageUrl + '" is loaded.');

				var documentHtml = pageObj.evaluate(function () {
					/*
					 * Keep in mind, that angular might either not be loaded at the moment or
					 * it's api might be changed dramatically in the future.
					 * Note: check for page loading status works only if you have automatically
					 * bootstrapped application on the page (either via ng-app, or data-ng-app,
					 * or x-ng-app, or ng_app).
					 * Hence wrap code block with try / catch
					 */

					try {
						var appDomElement = document.querySelector('[ng-app], [data-ng-app], [x-ng-app], [ng_app]');

						var http = angular.element(appDomElement).injector().get('$http');

						return http.pendingRequests.length ? false : document.documentElement.outerHTML;
					} catch (err) {
						return false;
					}
				});

				if (!!documentHtml) {
					if (jobParams.removeMetaFragment) {
						documentHtml = documentHtml.replace(/<\s*?meta\s*?name=\"fragment\"\s*?content=\"\!\"\s*?\/?>/gi, '');
					}

					pageHtml += documentHtml;

					utils.log.add('Page "' + websitePageUrl + '" is loaded, writing output to file: ' + websitePageOutputFile);

					fs.write(websitePageOutputFile, pageHtml, {
						mode: 'w',

						charset: 'utf-8'
					});

					utils.log.add('Proceeding to the remaining pages...');

					loadPages(websitePages);
				} else {
					utils.log.add('Page ' + websitePageUrl + ' is not yet loaded. Wait for ' + pageLoadingTimeout + ' ms.');

					/*
					 * Note: at the moment there is no threshold for checks.
					 * Phantom js will continuously try to check page loading status
					 * after each pageLoadingTimeout ms. You have to kill phantom js
					 * explicitly if you want to stop process or wait for 5 minutes
					 * before process will be killed by timeout.
					 */

					setTimeout(pageLoader, pageLoadingTimeout);
				}
			};

			loadPageHtml();
		};

		utils.log.add('Opening page: "' + websitePageUrl + '"');

		pageObj.open(websitePageUrl);
	}

	loadPages(websitePages);
})();
