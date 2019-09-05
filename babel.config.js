module.exports = function(api) {
  api && api.cache(false);
  return {
    presets: [
      "module:@babel/preset-env"
    ],
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-transform-runtime", { regenerator: false }],
      ["@babel/plugin-proposal-throw-expressions"]
    ]
  };
};
