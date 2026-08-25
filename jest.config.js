module.exports = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(.*)src/config/database$': '<rootDir>/src/tests/testDb.js',
    '\\.\\./config/database$': '<rootDir>/src/tests/testDb.js',
  },
   setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.js'],
};