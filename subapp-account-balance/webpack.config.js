const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

const appPackageJson = require("./package.json");

module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === "development";
    const isEnvProduction = webpackEnv === "production";
    
  return {
    entry: "./src/index",
    mode: webpackEnv,
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      port: 3002,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "mfe_subapp_account_balance",
        library: { type: "var", name: "mfe_subapp_account_balance" },
        filename: "remoteEntry.js",
        shared: Object.keys(appPackageJson.peerDependencies),
        exposes: {
          "./index": "./src/index",
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
  };
};
