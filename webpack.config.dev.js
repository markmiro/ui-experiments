var path = require('path');
var webpack = require('webpack');
var buildHelper = require('./build-helper');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: buildHelper.entry,
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
