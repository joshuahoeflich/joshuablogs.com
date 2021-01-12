const path = require("path");

module.exports = function (config) {
  config.set({
    browsers: ["ChromeHeadless"],
    basePath: path.resolve(path.join(__dirname, "ci")),
    files: ["ci.js"],
    frameworks: ["cljs-test"],
    plugins: ["karma-cljs-test", "karma-chrome-launcher"],
    colors: true,
    logLevel: config.LOG_INFO,
    client: {
      args: ["shadow.test.karma.init"],
      singleRun: true,
    },
  });
};
