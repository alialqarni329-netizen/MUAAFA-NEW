/** @type {import('jest').Config} */

// babel-preset-expo inlines process.env.EXPO_PUBLIC_* at transform time.
// Setting them here (in the main Jest process) ensures workers inherit them
// before any module is transformed.
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-abc123';

const config = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
  ],
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@constants/(.*)$': '<rootDir>/constants/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testRegex: '__tests__/.*\\.(test|spec)\\.[jt]sx?$',
  setupFiles: ['<rootDir>/jestSetup.js'],
};

module.exports = config;
