const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');
const { rules } = require('./common-rules');
const { plugins } = require('./common-plugins');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    ...plugins,
    new webpack.DefinePlugin({
      'process.env.SERVICE_URL': JSON.stringify('api/'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    splitChunks: {
      // To split up js code to different bundles.
      chunks: 'all', // Now bundle with our code will be cleaned up
    }, // from vendors imports (2mb ~> 100kb)
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()], // to minimize file size
  },
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
});
