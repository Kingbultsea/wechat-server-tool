module.exports = {
  preset: 'ts-jest',
  globals: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: require('./package.json').version,
    __NODE_JS__: true,
  },
  moduleNameMapper: {
    '^@/(.*?)$': '<rootDir>/src/$1'
  },
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  rootDir: __dirname,
  testMatch: ['<rootDir>/src/**/__test__/**.spec.[jt]s?(x)'],
  testPathIgnorePatterns:  ['/node_modules/']
}
