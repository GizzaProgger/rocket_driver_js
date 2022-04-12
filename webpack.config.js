// webpack.config.js
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
    mode: 'production',
    entry: {
      main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'main.bundle.js',
    },
    resolve: {
      modules: [path.resolve('./src'), path.resolve('./node_modules')],
      extensions: ['', '.js', '.jsx']
    }
}