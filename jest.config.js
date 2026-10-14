// pnpm nests packages under node_modules/.pnpm/<pkg>/node_modules/<pkg>, so allow both levels.
const transformed =
  '\\.pnpm|(jest-)?react-native|@react-native|expo|@expo|@reduxjs|immer|redux|reselect';

module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  transformIgnorePatterns: [`/node_modules/(?!(${transformed}))`],
  testPathIgnorePatterns: ['/node_modules/', '/tools/'],
};
