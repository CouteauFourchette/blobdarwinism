const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const extractSass = new ExtractTextPlugin({
  filename: "style.css",
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    loaders: [
      {
        test: [/\.js$/],
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.scss$/,
        loader: extractSass.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],
          // use style-loader in development
          fallback: "style-loader",
        })
      }
    ],
  },

  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '*'],
  },

  plugins: [
    extractSass,
  ],
};
