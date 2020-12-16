const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { rules } = require('./common-rules');
const { plugins } = require('./common-plugins');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    ...plugins,
    new webpack.DefinePlugin({
      'process.env.SERVICE_URL': JSON.stringify('http://localhost:4004/'),
    }),
  ],
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
});
