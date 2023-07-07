const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    'css-loader'
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
    main: ['@babel/polyfill', './index.js'],
    analytics: './analytics.ts'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
	resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
	optimization: optimization(),
  devServer: {
    static: {
      directory: './src',
    },
    port: 4200,
    hot: isDev
  },
	plugins: [
		new HTMLWebpackPlugin({
			template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
		}),
		new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
	],
	module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders() // [MiniCssExtractPlugin.loader, 'css-loader'] // use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader')
      },
       {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        // use: ['file-loader']
				type: 'asset/resource'
      },
			{
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource'
      },
			  {
        test: /\.xml$/,
        use: ['xml-loader']
      },
			{
        test: /\.csv$/,
        use: ['csv-loader']
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      }
    ]
  }
}



//npm install --save @babel/polyfill