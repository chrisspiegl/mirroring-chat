module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: ['warn', 'never'],
    'no-unused-vars': 'warn',
    'max-len': 0,
    'vue/max-attributes-per-line': 'off',
    radix: ['error', 'as-needed'],
    'func-names': ['error', 'as-needed', {
      generators: 'as-needed',
    }],
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: [
          'node_modules',
          '.', // replace with your app-module-path directory
        ],
      },
    },
  },
}
