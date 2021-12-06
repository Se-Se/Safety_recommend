module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "@tencent/eslint-config-tencent",
    "@tencent/eslint-config-tencent/ts",
    "@tencent/eslint-config-tencent/prettier",
  ],
  plugins: [
    "@typescript-eslint",
    "eslint-comments",
    "jest",
    "unicorn",
    "react-hooks",
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    "prettier/prettier": 0,
    "react/sort-comp": 0,
    "react/prop-types": 0,
    "react/forbid-prop-types": 0,
    "react/require-default-props": 0,
    "react/jsx-props-no-spreading": 0,
    "react/destructuring-assignment": 0,
    "react/jsx-one-expression-per-line": 0,
    "react/no-danger": 2,
    "react/self-closing-comp": 2,
    "react/no-array-index-key": 2,
    "react-hooks/exhaustive-deps": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "import/export": 0,
    "import/no-cycle": 0,
    "import/prefer-default-export": 0,
    "import/no-unresolved": [1, { ignore: ["^@tea/", "@src/", "@i18n/"] }],
    "import/no-extraneous-dependencies": [
      1,
      {
        optionalDependencies: true,
        devDependencies: [
          "**/tests/**..{ts,js,jsx,tsx}",
          "**/_test_/**.{ts,js,jsx,tsx}",
          "/mock/**/**.{ts,js,jsx,tsx}",
          "**/**.test.{ts,js,jsx,tsx}",
          "**/_mock.{ts,js,jsx,tsx}",
        ],
      },
    ],
    "@typescript-eslint/no-shadow": 0,
    "@typescript-eslint/no-this-alias": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/prefer-for-of": 0,
    "@typescript-eslint/member-ordering": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/prefer-optional-chain": 2,
    "@typescript-eslint/consistent-type-assertions": 0,
    "no-shadow": 0,
    "no-console": 0,
    "no-plusplus": 0,
    "no-continue": 0,
    "guard-for-in": 0,
    "no-unused-vars": 0,
    "no-param-reassign": 0,
    "operator-assignment": 0,
    "no-restricted-syntax": 0,
    "no-underscore-dangle": 0,
    "no-restricted-globals": 0,
    "class-methods-use-this": 0,
    "no-restricted-properties": 0,
  },
};