// webpack.config.js
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import HtmlWebpackPlugin from "html-webpack-plugin"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'rocketchat-client-api',
      type: 'umd',
    },
    publicPath: '/',
  },
  resolve: {
    alias: {
      SRC: path.resolve(__dirname, "src/")
    }
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './demo/index.html'
    }),
  ],
  module: {
  rules: [
    // the 'transform-runtime' plugin tells Babel to
    // require the runtime instead of inlining it.
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    }
    ]
  },
  devServer: {
    static: [
      { directory: path.join(__dirname, 'demo') },
      {  directory: path.join(__dirname, 'src') },
    ],
    compress: true,
    port: 9000,
  },
}