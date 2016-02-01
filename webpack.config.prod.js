var path = require('path');
var webpack = require('webpack');

var fs = require('fs');
var _ = require('ramda');

var files = fs.readdirSync('./src/').filter(function (file) {
  return path.extname(file) === '.js';
});

var entry = files.reduce(function (obj, file, index) {
  var key = path.basename(file, '.js');
  obj[key] = [
    './src/' + key
  ];
  return obj;
}, {});

module.exports = {
  devtool: 'source-map',
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist/static/'),
    filename: '[name].bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }]
  }
};
