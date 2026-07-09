const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const rootDir = __dirname;

  return {
    entry: "./src/index.js",
    output: {
      filename: isProduction
        ? "bundle.js"
        : "Facebook feed _ PWC Intranet_files/bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "styles.css",
            }),
          ]
        : []),
    ],
    devServer: {
      static: [
        {
          directory: rootDir,
          watch: true,
        },
        {
          directory: path.join(rootDir, "dist"),
          watch: false,
        },
      ],
      compress: true,
      port: "auto",
      hot: true,
      liveReload: true,
      watchFiles: [
        path.join(rootDir, "Facebook feed _ PWC Intranet.html"),
        path.join(rootDir, "Facebook feed _ PWC Intranet_files/**/*"),
        path.join(rootDir, "src/**/*"),
      ],
      open: true,
    },
    mode: isProduction ? "production" : "development",
  };
};
