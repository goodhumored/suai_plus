/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    background: path.resolve(__dirname, "src", "background.ts"),
    content: path.resolve(__dirname, "src", "content.ts"),
    popup: path.resolve(__dirname, "src", "popup", "index.tsx")
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    clean: true
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.s(c|a)ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.html$/i,
        loader: "html-loader"
      },
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: ".",
          to: ".",
          context: "static"
        },
        {
          from: path.resolve("src", "manifest.json"),
          to: "."
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: "./src/popup/popup.html",
      filename: "popup.html",
      excludeChunks: ["content", "background"]
    })
  ]
};
