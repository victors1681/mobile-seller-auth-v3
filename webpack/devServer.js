const path = require('path');

const getDevServer = () => ({
  contentBase: path.join(__dirname, '..', 'public'),
  compress: true,
  host: '0.0.0.0',
  port: 9000,
  hot: true,
  inline: true,
  watchContentBase: true,
  watchOptions: {
    ignored: /node_modules/
  },
  publicPath: '/',
  disableHostCheck: true,
  historyApiFallback: true
});

module.exports.getDevServer = getDevServer;
