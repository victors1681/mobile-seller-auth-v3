const path = require('path');
const { isDev } = require('./utils');

const getOutput = env => ({
  path: path.join(__dirname, '..', 'dist', 'ui'),
  publicPath: '/',
  sourceMapFilename: '[file].map',
  filename: isDev(env) ? 'app.js' : 'js/[name]'.concat('.[chunkhash:8].js')
});

module.exports.getOutput = getOutput;
