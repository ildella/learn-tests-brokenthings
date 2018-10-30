module.exports = {
  verbose: true,
  notify: true,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)(spec|test).js?(x)'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html', 'json-summary']
}
