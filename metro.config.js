const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const nodeModules = path.resolve(projectRoot, 'node_modules');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {},
  watchFolders: [nodeModules],
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
