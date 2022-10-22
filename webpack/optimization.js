const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const getTerserPlugin = () =>
  new TerserPlugin({
    cache: true,
    parallel: true,
    terserOptions: {
      compress: {
        dead_code: true,
        conditionals: true,
        booleans: true
      },
      module: false,
      output: {
        comments: false,
        beautify: false
      }
    }
  });

const getOptimizationAssetsPlugin = () =>
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: require('cssnano'),
    cssProcessorPluginOptions: {
      preset: ['default', { discardComments: { removeAll: true } }]
    },
    canPrint: true
  });

const getChunks = () => ({
  splitChunks: {
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      },
      styles: {
        test: /\.css$/,
        name: 'styles',
        chunks: 'all',
        enforce: true
      }
    }
  }
});

const getOptimization = () => ({
  minimize: true,
  minimizer: [new CssMinimizerPlugin(), '...'],
  runtimeChunk: {
    name: 'runtime'
  }
});

module.exports.getOptimization = getOptimization;
