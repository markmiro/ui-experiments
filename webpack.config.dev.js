var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

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
  devtool: 'cheap-module-eval-source-map',
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        // This is for the color npm library
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};
