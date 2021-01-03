const path = require("path");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: path.join(path.resolve(__dirname, "create-fake-blog.ts")),
};
