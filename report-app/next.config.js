const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  webpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.REPORT_SERVICE_HOST': JSON.stringify(process.env.REPORT_SERVICE_HOST),
        'process.env.DEPLOYMENT_SERVICE_HOST': JSON.stringify(process.env.DEPLOYMENT_SERVICE_HOST),
      })
    );
    return config;
  }
};
