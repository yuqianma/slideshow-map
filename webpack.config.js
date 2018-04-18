const internalIp = require('internal-ip');

const config = {
    mode: 'development',
    // devtool: 'cheap-eval-source-map',
    serve: {
        host: internalIp.v4.sync()
    },
    stats: {
        timings: true
    }
};

module.exports = config;