const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const nodeModules = path.resolve(projectRoot, 'node_modules');
// Linked via "file:" in package.json, so node_modules holds a symlink to this folder.
const mcBnplLibrary = path.resolve(projectRoot, '../mc-bnpl-rn-library');

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // The library has its own react / react-native dev copies; resolve its imports from the app instead.
    blockList: [new RegExp(`^${escapeRegExp(path.join(mcBnplLibrary, 'node_modules'))}[\\\\/].*`)],
    nodeModulesPaths: [nodeModules],
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react-native-device-info') {
        return {
          filePath: path.resolve(nodeModules, 'react-native-device-info/lib/commonjs/index.js'),
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
  watchFolders: [nodeModules, mcBnplLibrary],
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
