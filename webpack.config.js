const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all',
        }
    }
    if (isProd) {
        config.minimizer = [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}

const cssLoaders = (extra) => {
    const loaders = [MiniCssExtractPlugin.loader, 'css-loader']
    if (extra) {
        loaders.push(extra)
    }
    return loaders
}

module.exports = {

    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },


    output: {
        path: path.resolve(__dirname, './dist'),
        clean: true,
        filename: '[name].bundle.js',
    },

    resolve: {
        extensions: ['.js', '.ts', 'scss'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },

    optimization: optimization(),
    devServer: {
        port: 9000,
        hot: isDev
    },

  

    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/index.html'), // шаблон
            filename: 'index.html', // название выходного файла
        
        
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/images/[name][ext]'
                }
            },
            {
               test: /\.(ttf|woff|woff2|eot)$/,
               type: 'asset/resource'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
                  },
                }
              }
        ]
    }
}

