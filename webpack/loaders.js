const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { isDev } = require("./utils");

const getBabelLoader = () => ({
  test: /\.(j|t)s(x)?$/,
  exclude: /node_modules/,
  use: ["cache-loader", "babel-loader?cacheDirectory", "thread-loader"]
});

const getCssLoader = env => ({
  test: /\.(sc|c)ss$/,
  use: [
    isDev(env) ? "style-loader" : MiniCssExtractPlugin.loader,
    "css-loader",
    "sass-loader"
  ]
});

const getFileLoader = () => ({
  test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|)$/,
  loader: "url-loader"
});

const getXmlRawLoader = () => ({
  test: /\.xml$/,
  loader: "raw-loader"
});

const getTsLoader = () => ({
  test: /\.ts(x?)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "ts-loader"
    }
  ]
});

const getLoaders = env =>
  [
    getBabelLoader(),
    getCssLoader(env),
    getFileLoader(),
    getXmlRawLoader(),
    getTsLoader()
  ].filter(loader => loader);

module.exports.getLoaders = getLoaders;
