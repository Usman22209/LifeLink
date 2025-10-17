module.exports = {
  root: true,
  extends: ["@react-native", "plugin:prettier/recommended"],
  plugins: ["unused-imports"],
  settings: {
    "import/resolver": {
      "babel-module": {},
    },
  },
  rules: {
    "unused-imports/no-unused-imports": "error",
    "no-unused-vars": [
      "warn",
      {
        vars: "all",
        args: "after-used",
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],

    "prettier/prettier": [
      "warn",
      {
        printWidth: 100,
        tabWidth: 2,
        singleQuote: false,
        trailingComma: "all",
        bracketSpacing: true,
        arrowParens: "avoid",
        endOfLine: "auto",
      },
    ],
  },
};
