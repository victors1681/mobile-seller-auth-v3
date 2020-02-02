const path = require("path");

const getResolve = () => ({
  alias: {
    components: path.join(__dirname, "..", "src", "components"),
    contexts: path.join(__dirname, "..", "src", "contexts"),
    hooks: path.join(__dirname, "..", "src", "hooks"),
    layouts: path.join(__dirname, "..", "src", "layouts"),
    common: path.join(__dirname, "..", "src", "common"),
    utils: path.join(__dirname, "..", "src", "utils"),
    "react-dom": "@hot-loader/react-dom"
  },
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  modules: [
    path.resolve(__dirname, "..", "src"),
    path.resolve(__dirname, "..", "node_modules")
  ]
});

module.exports.getResolve = getResolve;
