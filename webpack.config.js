const webpack = require('webpack');
const path = require('path');

const plugins = [
  new webpack.optimize.ModuleConcatenationPlugin()
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
  	sourceMap: true
  }));

  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }));
}

module.exports = env => ({
  entry: {
    index: path.resolve(__dirname, 'src', 'index.js')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dest')
  },
  module: {
    rules: [
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  plugins
})
