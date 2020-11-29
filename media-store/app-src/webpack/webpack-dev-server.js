const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const { rules } = require('./common-rules');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: './src/index.jsx',
    react: ['react', 'react-dom'],
    lodash: ['lodash'],
    moment: ['moment'],
    events: ['events'],
    axios: ['axios'],
    antd: ['antd'],
  },
  devServer: {
    contentBase: './dist',
    compress: true, // compress files to gzip to increase download speed
    port: 3000,
    disableHostCheck: false, // by default true, it is not recomended,
    // because it makes app vulnerable to DNS rebinding attacks
    headers: {
      'X-Custom-header': 'custom', // this requires apps with authentication
      // useful config obj
    },
    open: true, // open the browser after server had been started
    hot: true, // hot module replacement
    historyApiFallback: true, // needs for react-router-dom
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: '',
    }),
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      'process.env.SERVICE_URL': JSON.stringify('http://localhost:4004/'),
    }),
    new webpack.HotModuleReplacementPlugin(), // for hot module replacement option of devServer
  ],
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
};
