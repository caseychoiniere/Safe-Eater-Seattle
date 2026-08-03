const { override, addDecoratorsLegacy } = require('customize-cra');

const addWebpackFallbacks = () => (config) => {
  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    assert: require.resolve('assert/'),
  };

  return config;
};

module.exports = override(
    addDecoratorsLegacy(),
    addWebpackFallbacks()
);
