const path = require('path');

module.exports = {
  entry: './src/widget-init.js', // Ensure this path is correct
  output: {
    filename: 'widget.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MyWidget',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // To handle both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
