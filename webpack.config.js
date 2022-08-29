import path from "path";
import { dirname } from "path";
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    entry: './demo/demo.js',
    mode: "production",
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };