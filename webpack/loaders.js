const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { isDev, isProd } = require('./utils');

const getBabelLoader = () => ({
  test: /\.(j|t)s(x)?$/,
  exclude: /node_modules/,
  use: ['babel-loader']
});

const getCssLoader = env => ({
  test: /\.(sc|c)ss$/,
  use: [
    isDev(env) ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    'sass-loader'
  ]
});

const getFileLoader = () => ({
  test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|)$/,
  loader: 'file-loader',
  options: {
    name: 'images/[name].[ext]'
  }
});

const getXmlRawLoader = () => ({
  test: /\.xml$/,
  loader: 'raw-loader'
});

const getEslintLoader = env => {
  if (isProd(env)) {
    return;
  }

  return {
    enforce: 'pre',
    test: /\.js?$/,
    exclude: [path.resolve(__dirname, '../node_modules')],
    use: [
      {
        loader: 'eslint-loader',
        options: {
          cache: true,
          fix: true,
          failOnWarning: true,
          failOnError: true
        }
      }
    ]
  };
};

const getTsLoader = () => ({
  test: /\.ts(x?)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'ts-loader'
    }
  ]
});

const getLoaders = env =>
  [
    getBabelLoader(),
    getCssLoader(env),
    getFileLoader(),
    getXmlRawLoader(),
    getTsLoader(),
    getEslintLoader(env)
  ].filter(loader => loader);

module.exports.getLoaders = getLoaders;
