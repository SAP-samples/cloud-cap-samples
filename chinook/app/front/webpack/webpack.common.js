const path = require('path');

module.exports = {
  entry: {
    app: './src/index.jsx', // Bundle with our code
    react: ['react', 'react-dom'],
    lodash: ['lodash'],
    moment: ['moment'],
    events: ['events'],
    axios: ['axios'],
    antd: ['antd'],
  },
  output: {
    // [name] - name of the entry (bundle),
    // [checksum] or [hash] - to cache different bundles
    // from update when developing (doing changes in the files)
    filename: '[name].[fullhash].js',
    // in this folder path bundles will be placed
    path: path.resolve(__dirname, '../../build/static'),
    // where you uploaded your bundled files. (Relative to server root)
    // needs for react-router-dom
    publicPath: '/static/',
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
};
