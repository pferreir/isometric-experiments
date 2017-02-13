/* globals module: false, __dirname: false */

var path = require('path');

module.exports = {
    target: 'web',
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: './main.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['es2015', 'stage-0']
                }
            },
            {
                test: /\.png$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.jpg$/,
                loader: 'file-loader'
            },
            {
                test: /\.scss$/,
                loader: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },

    output: {
        path: path.join(__dirname, 'static'),
        sourceMapFilename: '[name].js.map',
        filename: '[name].js'
    }
};
