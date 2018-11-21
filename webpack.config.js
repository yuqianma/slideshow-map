const path = require('path');
const internalIp = require('internal-ip');
const webpack = require('webpack');

const config = {
  mode: 'development',
  // devtool: 'cheap-eval-source-map',
  entry: {
    'debug': './debug/index.js',
    'dev': './dev/index.js',
    'dev-three': './dev/three.js',
    'dev-mapbox': './dev/mapbox.js',
    'test': './test/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /test\.js$/,
      use: 'mocha-loader',
      exclude: /node_modules/,
    }]
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    useLocalIp: true
  },
  stats: {
    timings: true
  },
  plugins: [
    new webpack.DefinePlugin({
      '__DEV__': JSON.stringify(true),
    }),
    new webpack.ProvidePlugin({
      THREE: [path.join(__dirname, 'src/LibThree.js'), 'THREE'],
      expect: ['chai', 'expect']
    }),
  ]
};

module.exports = config;