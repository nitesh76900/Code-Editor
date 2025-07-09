// client/craco.config.js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['javascript', 'python', 'java'],
        filename: 'static/js/[name].worker.js',
        publicPath: '/', // Ensure workers are served from rootjoner: root
      }),
    ],
  },
};