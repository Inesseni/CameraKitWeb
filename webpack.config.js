const path = require("path");

module.exports = {
  entry: "./src/assets/newScript.js", // Ensure this points to your JavaScript entry file
  output: {
    filename: "packed.js",
    path: path.resolve(__dirname, "docs"),
  },
  resolve: {
    extensions: [".js"], // Ensure .js is included in extensions
  },
  module: {
    rules: [
      // Add any loaders you need, for example, for CSS or other assets
    ],
  },
  optimization: {
    minimize: false,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "docs"),
    },
    client: {
      overlay: false,
    },
    compress: true,
    port: 9000,
  },
};
