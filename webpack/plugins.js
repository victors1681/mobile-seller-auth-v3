const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { isProd, isDev } = require('./utils');

const getHtmlWebpackPlugin = (env) =>
  new HtmlWebpackPlugin(
    Object.assign(
      {
        filename: 'index.html',
        template: path.join(__dirname, '..', 'public', 'index.html'),
        inject: true
      },
      isProd(env) && {
        minify: {
          removeComments: true,
          collapseWhitespace: true
        }
      }
    )
  );

const getBundleAnalyzerPlugin = (env) => {
  return env.analyze && new BundleAnalyzerPlugin();
};

const getMiniCssExtractPlugin = (env) => {
  if (isProd(env)) {
    return new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: '[id].css'
    });
  }
};

const getHMR = (env) => {
  if (isDev(env)) {
    return new webpack.HotModuleReplacementPlugin();
  }
};

const getCleanWebpackPlugin = (env) => {
  if (isProd(env)) {
    return new CleanWebpackPlugin(['dist/ui/js', 'dist/ui/css'], {
      root: path.join(__dirname, '..')
    });
  }
};

const getEnvVariables = () => {
  return new webpack.DefinePlugin({
    'process.env.EMULATOR': JSON.stringify(process.env.EMULATOR)
  });
};

const getPlugins = (env) => [getHtmlWebpackPlugin(env), getBundleAnalyzerPlugin(env), getMiniCssExtractPlugin(env), getHMR(env), getCleanWebpackPlugin(env)].filter((plugin) => plugin);

module.exports.getPlugins = getPlugins;
