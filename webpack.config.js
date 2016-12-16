'use strict';

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractText = require('extract-text-webpack-plugin');

const apiUrl = process.env.API_URL || 'http://localhost:3000';
const googleAPIKey = process.env.GMAPS_API_KEY;

var plugins = [
  new ExtractText('bundle.css'),
  new webpack.DefinePlugin({
    __API_URL__: JSON.stringify(apiUrl),
    __API_KEY__: JSON.stringify(googleAPIKey)
  })
];

module.exports = {
  entry: `${__dirname}/app/entry.js`,
  plugins: plugins,
  output: {
    path: 'build',
    filename: 'bundle.js'
  },
  sassLoader: {
    includePaths: [`${__dirname}/app/scss/lib`]
  },
  postcss: function(){
    return [autoprefixer];
  },
  module : {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractText.extract('style', 'css!postcss!sass!')
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: '/node_modules/',
        query: {
          presets: ['es2015'],
          compact: false
        }
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(jpg|gif|png|ico)$/,
        loader: 'file$name=img[hash].[ext]'
      },
      {
        test: /\.svg.*/,
        loader: 'url$limit=10000&mimetype=image/svg+xml&name=fonts/[name].[ext]'
      },
      {
        test: /\.woff.*/,
        loader: 'file?name=fonts/[name].[ext]',
      },
      {
        test: /\.[ot]tf.*/,
        loader: 'url?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]'
      },
      {
        test: /\.eot.*/,
        loader: 'url?limit=10000&mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]'
      }
    ]
  }
};
