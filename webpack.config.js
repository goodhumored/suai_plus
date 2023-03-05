const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: path.resolve(__dirname, 'src', 'background.ts'),
    content: path.resolve(__dirname, 'src', 'popup', 'content.ts'),
    popup_style: path.resolve(__dirname, 'src', 'popup', 'popup.sass'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.sass$/i,
        use: [
					{
						loader: 'file-loader',
						options: { name: '[name].css'}
					},
          "sass-loader",
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: '.',
          to: '.',
          context: 'static'
        },
        {
          from: path.resolve('src', 'manifest.json'),
          to: '.'
        }
      ]
    }),
		new HtmlWebpackPlugin({
      filename: 'popup.html',
			template: path.resolve('src','popup','popup.html'),
      inject: false,
    })
  ]
};
