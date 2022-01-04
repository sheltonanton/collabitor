module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [
        [
            "@babel/plugin-transform-runtime",
            {
                "regenerator": true
            }
        ], [
            "babel-plugin-transform-require-ignore",
            {
                "extensions": [".css"]
            }
        ]
    ]
}