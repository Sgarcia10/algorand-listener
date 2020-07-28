const webpack = require('webpack');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: ['./src/app/main.ts'],
  target: 'node',
  externals: [nodeExternals()], 
  mode: 'production',
  devtool: 'source-map',
  node: {
    __dirname: false,
  },
  module: {
    rules: [{
      test: /\.ts?$/,
      use: [{
        loader: 'ts-loader',
        options: {
            configFile: "tsconfig.build.json"
        }
      }],
      exclude: /node_modules/
    }, ],
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({
      configFile: "./tsconfig.json"
    })]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: 'dist',
    libraryTarget: 'commonjs',
  },
};
