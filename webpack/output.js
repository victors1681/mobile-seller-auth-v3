const path = require('path');
const { isDev } = require('./utils');

const getOutput = (env) => ({
  path: path.join(__dirname, '..', 'dist', 'ui'),
  publicPath: '/',
  sourceMapFilename: '[file].map',
  filename: isDev(env) ? '[name].bundle.js' : 'js/[name]'.concat('.[contenthash].js')
});

module.exports.getOutput = getOutput;
