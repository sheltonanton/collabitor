module.exports = (options) => {
  let config = {
    presets: ['@babel/preset-env']
  }

  if(options.env("test")) {
    config = Object.assign(config, {
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
    });
  }

  return config;
}
