const webpack = require("webpack");
const resolve = require("resolve");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = webpack.container;
const path = require("path");

const paths = require("./config/paths");
const modules = require("./config/modules");
const getClientEnvironment = require("./config/env");

const postcssNormalize = require("postcss-normalize");

const appPackageJson = require(paths.appPackageJson);

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== "false";

const isExtendingEslintConfig = process.env.EXTEND_ESLINT === "true";

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);


module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  // Variable used for enabling profiling in Production
  // passed into alias object. Uses a flag if passed into the build command
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes("--profile");

  // We will provide `paths.publicUrlOrPath` to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
  return {
    entry: "./src/index",
    mode: "development",

    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, "public"),
      historyApiFallback: {
        index: "/index.html",
      },
        port: 3000,
    },
    //   output: {
    //     publicPath: "http://localhost:3001/",
    //   },
    resolve: {
        extensions: ['*', '.mjs', '.js', '.jsx']
      },
    module: {
      rules: [
        // {
        //   test: /bootstrap\.js$/,
        //   loader: "bundle-loader",
        //   options: {
        //     lazy: true,
        //   },
        // },
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            presets: ["react-app"],
          },
        },
      ],
    },
    output: {
        //  must specified output.publicPath otherwise
        //  devServer.historyApiFallback will not work
        publicPath: '/'
      },
    plugins: [
      new ModuleFederationPlugin({
        name: "mfe_mainapp",
        shared: Object.keys(appPackageJson.dependencies),
      }),
      new webpack.DefinePlugin(env.stringified),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
  };
};
