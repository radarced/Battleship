import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";

export default {
  mode: "development", // Use 'production' for optimized builds
  entry: "./src/main.js", // The starting point of your app
  output: {
    filename: "./src/main.js", // The name of the bundled output file
    path: path.resolve(import.meta.dirname, "dist"), // The output folder
    clean: true,
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
  module: {
    rules: [
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      { test: /\.html$/i, use: ["html-loader"] },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
