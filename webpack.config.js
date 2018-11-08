const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ReactHotLoader= require('react-hot-loader/babel')
let pathsToClean = [
    'dist',
    'build'
  ]
let cleanOptions = {
  root:     '/full/webpack/root/path',
  exclude:  ['shared.js'],
  verbose:  true,
  dry:      false
} 

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
            exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js', '.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new ReactHotLoader(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('style.css'),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./manifest.json')
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new CleanWebpackPlugin(pathsToClean,cleanOptions)
    ]
};