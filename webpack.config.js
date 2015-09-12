var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: {
    index: [
      'webpack-hot-middleware/client',
      './src/index'
    ],
    tetris: [
      'webpack-hot-middleware/client',
      './src/tetris'
    ]
  },
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
        test: /\.js$/,
        loader: 'babel',
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
