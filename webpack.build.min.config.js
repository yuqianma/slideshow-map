const config = require('./webpack.build.config');
const TerserPlugin = require('terser-webpack-plugin');

config.output.filename = 'VanSlideshowMap.min.js',

config.optimization = {
  minimizer: [new TerserPlugin()]
}

console.log(config);

module.exports = config;
