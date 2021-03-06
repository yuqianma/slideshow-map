const path = require('path');
const config = require('./webpack.config');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: 'VanSlideshowMap.js',
    path: path.join(__dirname, 'dist')
  },
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    new webpack.DefinePlugin({
      '__DEV__': JSON.stringify(true),
    }),
    new webpack.ProvidePlugin({
      THREE: [path.join(__dirname, 'src/LibThree.js'), 'THREE'],
      // expect: ['chai', 'expect']
    }),
  ]
};

