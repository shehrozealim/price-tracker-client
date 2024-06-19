const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const webpack = require("webpack");
const dotenv = require('dotenv').config({ path: __dirname + '/.env' })

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve('./src/index.tsx'),
        background: [path.resolve('./src/homepage/homepage.tsx'), path.resolve('./src/background/background.ts')],
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                test: /\.tsx$/,
                exclude: /node_modules/
            },
            {
                use: ['style-loader', 'css-loader'],
                test: /\.css$/i,
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '/public/icons/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve('./src/manifest.json'), to: path.resolve('dist') },
            ],
        }),
        new HtmlWebpackPlugin({
            title: 'Price Tracker',
            filename: 'popup.html',
            chunks: ['popup']
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.parsed),
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: "[name].js"
    },

}