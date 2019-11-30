module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'fbjs',
    'prettier',
  ],
  parser: 'babel-eslint',
  plugins: ['react', 'sort-imports-es6-autofix', 'prettier'],
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      classes: true,
      objectLiteralShorthandMethods: true,
      experimentalObjectRestSpread: true,
      arrowFunctions: true,
      modules: true,
    },
    sourceType: 'module',
  },
  rules: {
    semi: 0,
    'max-len': [
      'error',
      {
        code: 80,
      },
    ],
    indent: 0,
    'no-constant-condition': 0,
    'no-extra-semi': 0,
    'no-unused-vars': 2,
    'no-undef': 2,
    'react/jsx-uses-vars': 2,
    'react/jsx-key': 2,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-uses-react': 2,
    'no-irregular-whitespace': 2,
    'sort-imports-es6-autofix/sort-imports-es6': [
      'error',
      {
        ignoreCase: true,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        parser: 'babylon',
        semi: false,
        requirePragma: false,
        tabWidth: 2,
        useTabs: false,
      },
    ],
  },
}
