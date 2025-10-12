const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const srcRoot = path.join(projectRoot, 'src');

const config = {
  resolver: {
    extraNodeModules: {
      '@assets': path.join(srcRoot, 'assets'),
      '@theme': path.join(srcRoot, 'shared', 'theme'),
      '@components': path.join(srcRoot, 'shared', 'components'),
      '@hooks': path.join(srcRoot, 'shared', 'hooks'),
      '@utils': path.join(srcRoot, 'shared', 'utils'),
      '@screens': path.join(srcRoot, 'screens'),
      '@services': path.join(srcRoot, 'shared', 'services'),
      '@config': path.join(srcRoot, 'shared', 'config'),
      "@shared": path.join(srcRoot, 'shared'),
      "@navigation": path.join(srcRoot, 'navigation'),
      "@store": path.join(srcRoot, 'store'),
      "@providers": path.join(srcRoot, 'shared', 'providers'),
    },
  },
  watchFolders: [srcRoot],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
