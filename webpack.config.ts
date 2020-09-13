import CopyWebpackPlugin from "copy-webpack-plugin"
import HTMLWebpackPlugin from "html-webpack-plugin"

module.exports = {
  entry:   './src/index.tsx',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test:   /[\\/]node_modules[\\/]/,
          name:   'vendor',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      { test: /\.ts(x?)$/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'  }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      "@components": __dirname + "/src/components",
      "@core":       __dirname + "/src/core",
      "@app":        __dirname + "/src"
    }
  },
  devServer: {
    historyApiFallback: true,
    port: 8080
  },
  plugins: [
    new CopyWebpackPlugin({ patterns: [{ from: 'public/favicon.ico' }]}),
    new HTMLWebpackPlugin({ template: './public/index.html'           })
  ],
}
