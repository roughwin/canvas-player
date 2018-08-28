const webpack = require('webpack');
const path = require('path');
module.exports = {
  entry: ['./src/app.js'],
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
    // chunkFilename: '[name].chunk-[chunkhash].js',
    publicPath: '/public',
  },
  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    hot: true,
    port: 8080,
    host: '0.0.0.0',
    stats: {
      colors: true,
      chunks: false,
      chunkModules: false,
      children: false
    },
  },
  devtool: 'eval-source-map',
}