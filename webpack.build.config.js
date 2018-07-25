const path = require('path');
const config = require('./webpack.config');

module.exports = {
  mode: 'production',
  entry: {
    main: './dev/index.js'
  },
  output: {
    filename: 'VanSlideshowMap.js',
    path: path.join(__dirname, 'dist')
  },
  plugins: config.plugins
};

