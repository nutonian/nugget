const path = require('path');
const webpack = require('webpack');

const isProd = (process.env.NODE_ENV === 'production');

const webpackConfig = {
    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
    entry: './lib/Nugget',
    externals: {
        d3: 'd3'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            options: {
                presets: [
                    ['es2015', { modules: false }]
                ],
            },
            exclude: /node_modules/,
        }],
    },
    output: {
        filename: 'Nugget.js',
        library: 'Nugget',
        libraryTarget: 'umd',
        path: path.join(__dirname, 'build'),
    },
    plugins: [
        new webpack.BannerPlugin('@license Nugget.js by Nutonian, Inc. http://www.nutonian.com'),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.SourceMapDevToolPlugin({ filename: '[file].map' }),
    ],
    stats: {
        colors: true,
        errors: true,
    }
};

if (isProd) {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = webpackConfig;
