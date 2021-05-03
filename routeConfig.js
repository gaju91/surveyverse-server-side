// routes/index.js
var _ = require('lodash');
var fs = require('fs');

module.exports = function (app) {
  var routedir = __dirname + '/routes';
  fs.readdirSync(routedir).forEach(function (file) {
    // Remove extension from file name
    var basename = file.split('.')[0];

    // Only load files that aren't directories and aren't blacklisted
    if (!fs.lstatSync(routedir + '/' + file).isDirectory()) {
      app.use('/api/' + basename, require(__dirname + '/routes/' + file));
      // app.use('/', require(__dirname + '/routes/' + file));
    }
  });
};