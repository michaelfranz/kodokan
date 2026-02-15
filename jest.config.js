module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native|react-native|' +
      '@react-navigation|' +
      'react-native-safe-area-context|' +
      'react-native-screens|' +
      'react-native-gesture-handler|' +
      'react-native-reanimated|' +
      'react-native-vector-icons|' +
      'react-native-elements|' +
      'react-native-ratings|' +
      'react-native-size-matters|' +
      'react-native-video|' +
      'react-native-fs|' +
      'react-native-progress-circle|' +
      'fuse\\.js|' +
      'color|' +
      'color-string|' +
      'color-name|' +
      'color-convert|' +
      'simple-swizzle' +
    ')/)',
  ],
  moduleNameMapper: {
    '\\.(mp3|mp4|m4v|wav|png|jpg|jpeg|gif)$': '<rootDir>/jest.fileTransformer.js',
  },
};
