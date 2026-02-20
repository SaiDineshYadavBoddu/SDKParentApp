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
  resolver: {
    // Force Metro to resolve react-native-ssl-pinning and its dependency from project node_modules
    extraNodeModules: {
      'react-native-ssl-pinning': path.resolve(nodeModules, 'react-native-ssl-pinning'),
      q: path.resolve(nodeModules, 'q'),
    },
  },
  watchFolders: [nodeModules],
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
