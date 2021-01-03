const path = require("path");

module.exports = {
  extends: [
    "airbnb-typescript/base",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  ignorePatterns: "!.eslintrc.js",
  parserOptions: {
    project: path.resolve(path.join(__dirname, "tsconfig.linting.json")),
    warnOnUnsupportedTypeScriptVersion: false,
  },
  env: {
    node: true,
  },
  rules: {
    "arrow-body-style": 0,
  },
};
