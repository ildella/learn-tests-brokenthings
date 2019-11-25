module.exports = {
  testEnvironment: 'node',
  verbose: false,
  notify: false,
  notifyMode: 'failure-change, success-change',
  testMatch: ['**/?(*.)(spec|test).js?(x)'],
  // testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules'],
  setupFilesAfterEnv: ['./jest-helpers.js'],
  collectCoverage: false,
  collectCoverageFrom: [
    // '**/src/*.{js,jsx}',
    '**/src/**/*.{js,jsx}',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {branches: 80, functions: 80, lines: 80, statements: 80}
  },
  coverageReporters: ['text', 'text-summary', 'json', 'json-summary', 'lcov', 'clover', 'html'],
}
