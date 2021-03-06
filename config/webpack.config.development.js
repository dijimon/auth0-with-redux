const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

module.exports = {
  mode: 'development',
  entry: paths.entryPoint,
  output: {
    path: paths.outputPath,
    publicPath: '/',
    filename: path.join('js', '[name].js'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', paths.src],
    alias: {
      config: paths.appConfig,
      static: paths.publicFiles,
      public: paths.publicFiles,
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx|.js?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.svg$/,
        options: {
          includePaths: [`${paths.publicFiles}/assets`],
        },
        loader: 'svg-sprite-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [paths.scss],
            },
          },
        ],
      },
      {
        include: [paths.publicFiles],
        exclude: [path.join(paths.publicFiles, 'index.html')],
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.publicFiles, 'index.html'),
      favicon: `${paths.publicFiles}/assets/favicon-platform.png`,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.PROJECT_ENV': JSON.stringify(process.env.PROJECT_ENV),
      'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: process.env.PORT || 3000,
  },
};
