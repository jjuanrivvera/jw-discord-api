module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/startup/**',
        '!src/config/**'
    ],
    coverageThreshold: {
        global: {
            branches: 15,
            functions: 60,
            lines: 55,
            statements: 55
        }
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    verbose: true,
    testTimeout: 10000
};
