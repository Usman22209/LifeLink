module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin', 
    ['module:react-native-dotenv'],
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
          '.svg',
        ],
        alias: {
          '@assets': './src/assets',
          '@theme': './src/shared/theme',
          '@components': './src/shared/components',
          '@screens': './src/screens',
          
        },
      },
    ],
  ],
};
