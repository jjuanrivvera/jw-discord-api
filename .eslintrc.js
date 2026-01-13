module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single', { avoidEscape: true }],
        'semi': ['error', 'always'],
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-console': 'off',
        'prefer-const': 'error'
    }
};
