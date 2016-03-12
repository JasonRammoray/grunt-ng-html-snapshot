(function() {
  'use strict';

  var fs = require('fs');

  exports.shouldCreateThreeFiles = function(test) {
    var filesExists = [
      './tmp/guide.html',

      './tmp/misc-contribute.html',

      './tmp/job-log.log'
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
})();