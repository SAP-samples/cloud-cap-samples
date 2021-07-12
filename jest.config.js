module.exports = {
  testEnvironment: 'node',
  transform: {
    "\\.ts$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      diagnostics: {
        ignoreCodes: [
          151001 // see https://githubmemory.com/repo/kulshekhar/ts-jest/issues/2722
        ]
      }
    }
  }
}
