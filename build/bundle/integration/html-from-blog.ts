import path from "path";
import ora from "ora";
import createFakeBlog from "./create-fake-blog";
import { writeBlogHtml } from "../src/lib";

const main = async () => {
  const spinner = ora("Beginning to create HTML...").start();
  try {
    await createFakeBlog();
    await writeBlogHtml({
      blogPath: path.resolve(path.join(__dirname, "example-blog")),
      htmlPath: path.resolve(path.join(__dirname, "example-html")),
    });
    spinner.succeed('HTML Creation successful.');
  } catch (err) {
    spinner.fail("Could not create HTML");
    throw err;
  }
};

if (require.main === module) {
  main();
}
