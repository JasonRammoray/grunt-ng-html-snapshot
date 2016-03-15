(function() {
  'use strict';

  var fs = require('fs');

  exports.shouldNOTRemoveMetaFragmentTagFromFiles = function(test) {
    var metaFragmentWasNOTRemoved = [
      './tmp/guide.html',

      './tmp/misc-contribute.html'
    ].every(function(file) {
      var regExp = /<\s*?meta\s*?name=\"fragment\"\s*?content=\"\!\"\s*?\/?>/gi;

      return fs.readFileSync(file, {
        encoding: 'utf8'
      }).match(regExp);
    });

    test.ok(metaFragmentWasNOTRemoved);

    test.done();
  };
})();