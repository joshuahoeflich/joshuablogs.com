import path from "path";
import ora from "ora";
import createFakeBlog from "./create-fake-blog";
import { generateBlog, PROJECT_ROOT } from "../src/lib";

const main = async () => {
  const spinner = ora("Beginning to create HTML...").start();
  try {
    await createFakeBlog();
    await generateBlog({
      blogPath: path.resolve(path.join(__dirname, "example-blog")),
      htmlPath: path.resolve(path.join(__dirname, "example-html")),
      staticFilePath: path.join(PROJECT_ROOT, 'build', 'static-pages')
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
