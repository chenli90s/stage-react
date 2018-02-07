const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const BaseConfig = require('./webpack.base')
const HTMLPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV == 'development'

const config = webpackMerge
(
  BaseConfig, {
    entry: {
      app: path.join(__dirname, '../src/index.js')
    },
    output: {
      filename: '[name].[hash].js',
      path: path.join(__dirname, '../dist'),
      publicPath: '/public/',
    },

    plugins: [
      new HTMLPlugin({
        template: path.join(__dirname, '../src/index.html')
      })
    ]
  }
)


if (isDev) {
  config.entry = {
    app: ['react-hot-loader/patch',
      path.join(__dirname, '../src/index.js')]
  }
  config.devServer = {
    host: 'localhost',
    port: '8580',
    contentBase: path.join(__dirname, '../dist'),
    open: true,
    hot: true,
    overlay: {  //显示错误提示
      errors: true
    },
    publicPath: '/public',
    historyApiFallback: {
      index: '/public/index.html'
    },
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}


module.exports = config
