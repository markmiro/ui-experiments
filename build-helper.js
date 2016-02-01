var path = require('path');
var fs = require('fs');
var _ = require('ramda');

var files = fs.readdirSync('./src/').filter(function (file) {
  return path.extname(file) === '.js';
});

var entry = files.reduce(function (obj, file, index) {
  var key = path.basename(file, '.js');
  obj[key] = [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    './src/' + key
  ];
  return obj;
}, {});

module.exports = {
  entry: entry
};
