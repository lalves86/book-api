module.exports = {
  roots: [
    '<rootDir>/tests',
    '<rootDir>/src'
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/tests/**',
    '!**/config/**',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/infra/**',
    '!<rootDir>/src/app.ts',
    '!<rootDir>/src/server.ts',
    '!<rootDir>/src/**/ports/**',
    '!<rootDir>/src/**/dtos/**'
  ],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/tests/$1'
  }
}
