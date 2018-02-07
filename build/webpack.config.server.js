const path = require('path')
const webpackMerge = require('webpack-merge')
const BaseConfig = require('./webpack.base')
// const HTMLPlugin = require('html-webpack-plugin')

module.exports = webpackMerge(BaseConfig, {
    target: "node", //指定运行环境
    entry: {
        app: path.join(__dirname, '../src/server-entry.js')
    },
    output: {
        filename: 'server-entry.js',
        path: path.join(__dirname, '../dist'),
        // publicPath: '/public',
        libraryTarget: "commonjs2" //使用commonjs模块规范
    },

    // plugins: [
    //     new HTMLPlugin()
    // ]
})
