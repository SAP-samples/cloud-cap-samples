const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin({ dangerouslyAllowCleanPatternsOutsideProject: true }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
      filename: path.join(__dirname, '../../build/index.html'),
      publicPath: '/static/', // for js bundles path
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: '',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../public'),
          to: path.join(__dirname, '../../build'),
          globOptions: {
            dot: true,
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    new webpack.ProgressPlugin(),
  ],
};
