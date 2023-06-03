const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index: './src/Main.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'Build'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            // React
                            '@babel/preset-react',
                            // Env
                            '@babel/preset-env',
                            // TypeScript
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "public" }
            ]
        })
    ],
    resolve: {
        alias: {
            "@App": path.resolve(__dirname, 'src/'),
            "@Styles": path.resolve(__dirname, 'src/Styles/'),
            "@Components": path.resolve(__dirname, 'src/Components/'),
            "@Pages": path.resolve(__dirname, 'src/Pages/'),
        },
        extensions: ['', '.js', '.jsx', '.ts', '.tsx' , '.sass', '.scss' , '.css'],
    }
}