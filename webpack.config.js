const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const CSSMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const yaml = require('js-yaml')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimize = true;
        config.minimizer = [
            new TerserWebpackPlugin(),
            new CSSMinimizerWebpackPlugin(),
        ]
    }

    return config
}

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCSSExtractPlugin.loader,
            // options: {
            //     publicPath: (resourcePath, context) => {
            //         return path.relative(path.dirname(resourcePath), context) + '/'
            //     }
            // }
        },
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            'postcss-preset-env',
                            {
                              browsers: 'last 3 versions',
                              autoprefixer: { grid: true },
                            }
                        ]
                    ]
                }
            }
        }
    ]

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

const babelOptions = preset => {
    const options = {
        presets: [
            '@babel/preset-env'
        ]
    }

    if (preset) {
        options.presets.push(preset)
    }

    return options
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]

    return loaders
}

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets/images/favicon'),
                    to: path.resolve(__dirname, 'dist/assets/images/favicon')
                }
            ]
        }),
        new MiniCSSExtractPlugin({
            filename: filename('css')
        })
    ]

    if (isDev) {
        base.push(new ESLintWebpackPlugin())
    } 
    
    // if (isProd) {
    //     base.push(new BundleAnalyzerPlugin())
    // }

    return base
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    target: 'web',
    entry: {
        main: {
            import: ['@babel/polyfill', './index.js'],
            filename: './[name].js'
        },
        analytics: {
            import: './analytics.ts',
            filename: './[name].js'
        },
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        // assetModuleFilename: 'assets/[name][ext]'
    },
    resolve: {
        extensions: ['.js', '.json', '.scss'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        client: {
            overlay: true
        }
    },
    devtool: isDev ? 'source-map' : false,
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders(),
                generator: {
                    filename: 'assets/styles/[name][hash][ext]'
                }
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader'),
            },
            {
                test: /\.(ico|png|jpg|svg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: isDev ? 'assets/images/[name][ext]' : 'assets/images/[hash][ext]'
                },
                use: {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 70
                        },
                        webp: {
                            quality: 75
                        }
                    }
                }
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: isDev ? 'assets/fonts/[name][ext]' : 'assets/fonts/[hash][ext]'
                }
            },
            {
                test: /\.xml$/,
                use: ['xml-loader'],
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.yaml$/,
                type: 'json',
                parser: {
                  parse: yaml.parse,
                },
              },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
}