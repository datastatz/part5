module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    "indent": ["error", 2], // Enforce 2-space indentation
    "linebreak-style": ["error", "unix"], // Enforce Unix-style line endings
    "quotes": ["error", "single"], // Enforce single quotes
    "semi": ["error", "never"], // Enforce no semicolons
    "eqeqeq": "error", // Require `===` instead of `==`
    "no-trailing-spaces": "error", // Disallow spaces at end of lines
    "object-curly-spacing": ["error", "always"], // Enforce spaces inside {}
    "arrow-spacing": ["error", { "before": true, "after": true }], // Require spaces around `=>`
    "no-console": 0, // Allow `console.log()`
    "react/react-in-jsx-scope": "off", // Required for Next.js
    "react/prop-types": 0, // Disable PropTypes warnings
    "no-unused-vars": 0 // Allow unused variables
  },
}
