module.exports = function(api) {
  api && api.cache(false);
  return {
    presets: ["module:@babel/preset-env"],
    plugins: []
  };
};
