const path = require('path');
const internalIp = require('internal-ip');

const config = {
    mode: 'development',
    // devtool: 'cheap-eval-source-map',
    entry: {
        main: './src/index.js',
        'dev-three': './dev/three.js',
        'dev-mapbox': './dev/mapbox.js'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    serve: {
        host: internalIp.v4.sync(),
        // dev: {
        //     publicPath:
        // }
    },
    stats: {
        timings: true
    }
};

module.exports = config;