module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo auto-includes the Reanimated/Worklets plugin when
    // those packages are installed — do not add the plugin again here.
    presets: ['babel-preset-expo'],
  };
};
