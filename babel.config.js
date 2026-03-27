module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo automatically enables the Hermes parser and optimisations.
    // Explicitly passing { jsxRuntime: 'automatic' } ensures React JSX transform
    // runs through the Hermes-compatible path on both iOS and Android.
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@app': './app',
            '@components': './components',
            '@lib': './lib',
            '@hooks': './hooks',
            '@constants': './constants',
            '@types': './types',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
