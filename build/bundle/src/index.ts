import path from "path";
import ora from "ora";
import { generateBlog, PROJECT_ROOT } from "./lib";

const main = async () => {
  const spinner = ora("Beginning to create site...").start();
  try {
    await generateBlog({
      blogPath: path.resolve(path.join(PROJECT_ROOT, 'blog', 'final')),
      htmlPath: path.resolve(path.join(PROJECT_ROOT, 'dist')),
      staticFilePath: path.join(PROJECT_ROOT, 'build', 'static-pages')
    });
    spinner.succeed('Site generated successfully.');
  } catch (err) {
    spinner.fail("Could not create HTML");
    throw err;
  }
};

if (require.main === module) {
  main();
}
