const path = require('path');
const config = require('./webpack.config');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const git = require('git-rev-sync');

const __HASH__ = git.short(),
  __BUILD_TIME__ = new Date().toLocaleString();

console.log(__HASH__);

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: 'VanSlideshowMap.js',
    path: path.join(__dirname, 'dist')
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.DefinePlugin({
      '__DEV__': JSON.stringify(false),
      '__HASH__': JSON.stringify(__HASH__),
      '__BUILD_TIME__': JSON.stringify(__BUILD_TIME__)
    }),
    new webpack.ProvidePlugin({
      THREE: [path.join(__dirname, 'src/LibThree.js'), 'THREE'],
      expect: ['chai', 'expect']
    }),
  ]
};

