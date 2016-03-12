(function() {
  'use strict';

  var fs = require('fs');

  exports.shouldCreateTwoFilesWithoutExtension = function(test) {
    var filesExists = [
      './tmp/guide',

      './tmp/misc-contribute'
    ].every(function(file) {
      try {
        fs.accessSync(file);

        return true;
      } catch( error ) {
        return false;
      }
    });

    test.ok(filesExists);

    test.done();
  };

  exports.logFileShouldNotBeCreated = function(test) {
    var logDoesNotExists = false;

    try {
      fs.accessSync('./tmp/job-log.log');
    } catch( error ) {
      logDoesNotExists = true;
    }

    test.ok(logDoesNotExists);

    test.done();
  };
})();