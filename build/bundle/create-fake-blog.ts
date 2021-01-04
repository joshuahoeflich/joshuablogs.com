import ora from "ora";
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from "faker";
import { promises as fs, remove, mkdirp } from "fs-extra";
import path from "path";

faker.seed(314159);

const FAKE_BLOG_PATH = path.join(__dirname, "example-blog");

const createFakeMarkdown = (): string => {
  const title = faker.name.title();
  const description = faker.lorem.paragraph(5);
  const body = `${description} ${faker.lorem.paragraphs(10, "\n")}`;
  return `---
title: ${title}
description: ${description}
---

# ${title}

${body}`;
};

const getPrefix = (num: number): string => {
  if (num >= 100) return `${num}`;
  if (num >= 10) return `0${num}`;
  return `00${num}`;
};

const createFakeBlogEntry = async (_: unknown, index: number, __: Array<unknown>) => {
  const fileName = `${getPrefix(index)}-${faker.lorem.slug()}.md`;
  await fs.writeFile(path.join(FAKE_BLOG_PATH, fileName), createFakeMarkdown());
};

const createFakeBlogSilent = async () => {
  await remove(FAKE_BLOG_PATH);
  await mkdirp(FAKE_BLOG_PATH);
  return Promise.all(Array.from({ length: 1000 }).map(createFakeBlogEntry));
};

const createFakeBlog = async () => {
  const spinner = ora("Beginning to create blog for tests...").start();
  try {
    await createFakeBlogSilent();
    spinner.succeed("Blog created successfully.");
  } catch (err) {
    spinner.fail("Blog creation failed.");
    throw err;
  }
};

export default createFakeBlog;

if (require.main === module) {
  createFakeBlog();
}
