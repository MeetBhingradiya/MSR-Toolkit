const Webpack_Merge = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = Webpack_Merge.merge(config, {
    mode: 'production',
});