import fs from "fs";
import path from "path";
import {
  getBlogContexts,
  extractMarkdownContents,
  PROJECT_ROOT,
  BlogContext,
} from "./lib";

describe("Project root", () => {
  test("Points to the right directory", () => {
    expect(fs.readdirSync(PROJECT_ROOT).includes(".gitignore")).toBe(true);
  });
});

describe("Pure Markdown to HTML translation", () => {
  test("extractMarkdownContents maps markdown strings to a convenient form", () => {
    expect(
      extractMarkdownContents(`---
title: thingy
description: another thingy
---
# thingy

another thingy

this is a markdown document
`)
    ).toStrictEqual({
      title: "thingy",
      description: "another thingy",
      content: `<h1>thingy</h1>
<p>another thingy</p>
<p>this is a markdown document</p>\n`,
    });
  });
});

describe("File system interactions", () => {
  let blogs: Array<BlogContext>;
  beforeAll(async () => {
    const BIG_BLOG_TEST_DIR = path.resolve(path.join(__dirname, "big-blog"));
    blogs = await getBlogContexts(BIG_BLOG_TEST_DIR);
  });
  test("We can find all the blogs in our mock project", async () => {
    expect(blogs.length).toEqual(1000);
  });
  test("The next field in each blog is populated properly", () => {
    expect(blogs[0].next).toBe('Awesome Blog 001');
    expect(blogs[blogs.length - 1].next).toBe(null);
    expect(blogs[42].next).toBe('Awesome Blog 043');
    expect(blogs[543].next).toBe('Awesome Blog 544');
  });
  test("The previous field in each blog is populated properly", () => {
    expect(blogs[0].previous).toBe(null);
    expect(blogs[blogs.length - 1].previous).toBe('Awesome Blog 998');
    expect(blogs[42].previous).toBe('Awesome Blog 041');
    expect(blogs[543].previous).toBe('Awesome Blog 542');
  });
});
