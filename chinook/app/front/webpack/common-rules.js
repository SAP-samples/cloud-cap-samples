module.exports = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
    },

    {
      test: /\.(png|jpg)$/,
      use: [{ loader: 'url-loader' }],
    },
  ],
};
