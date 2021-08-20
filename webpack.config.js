/*
 * @Author: Obital 
 * @Date: 2021-08-19 18:06:07 
 * @Last Modified by: Obital
 * @Last Modified time: 2021-08-19 18:20:30
 */

let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let MiniCssExtractPlugin = require("mini-css-extract-plugin");
let OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

/**
 * lazy load 按需加载
 * 在js文件中配置
 */

let DIST_PATH = path.resolve(__dirname, "dist");

let commonCssLoaders = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: "../"
    }
  },
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      plugins: () => [
        require("postcss-preset-env")()
      ]
    }
  }
];

module.exports = {
  entry: "./src/main.js",

  output: {
    filename: "[name].[contenthash:10].js",
    path: DIST_PATH
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: commonCssLoaders
          },
          {
            test: /\.less$/,
            use: [
              ...commonCssLoaders,
              "less-loader"
            ]
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: {
                      version: 3
                    },
                    targets: {
                      chrome: "60",
                      firefox: "60",
                      ie: "9",
                      safari: "10",
                      edge: "17"
                    }
                  }
                ],
                "@babel/preset-react"
              ],

              // 开启babel缓存，第二次构建时会读取之前的缓存
              cacheDirectory: true
            }
          },
          {
            test: /\.(jpg|jpeg|gif|png)$/,
            loader: "url-loader",
            options: {
              limit: 9 * 1024,
              name: "[hash:12].[ext]",
              outputPath: "./img"
            }
          },
          {
            test: /\.html$/,
            loader: "html-loader"
          },
          {
            exclude: /\.(html|css|less|js|png|jpg|jpeg|png)$/,
            loader: "file-loader",
            options: {
              outputPath: "./assets",
              name: "[hash:12].[ext]"
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),

    new MiniCssExtractPlugin({
      filename: "./css/app.[contenthash:10].css"
    }),

    new OptimizeCssAssetsWebpackPlugin()
  ],

  /**
   * 1. 可将node_modules中的代码打包成一个chunk输出 
   */
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },

  mode: "development",

  devServer: {
    contentBase: DIST_PATH,
    port: 4443,
    open: true,
    compress: true
  },

  devtool: "eval-cheap-module-source-map"
}