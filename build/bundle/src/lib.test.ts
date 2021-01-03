import fs from "fs";
import path from 'path';
import { getBlogPosition, extractMarkdownContents, PROJECT_ROOT } from "./lib";

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
  test("We can get the position of a blog post from its file name", () => {
    expect(getBlogPosition("005_test.md")).toBe(5);
    expect(getBlogPosition("015_potato.md")).toBe(15);
    expect(getBlogPosition("315_test_test_test.md")).toBe(315);
    expect(getBlogPosition("42015_test.md")).toBe(42015);
    expect(getBlogPosition("00042015_test.md")).toBe(42015);
  });
});

describe("File system interactions", () => {
  test("We can get a correct array of absolute file names", () => {
    // const BIG_BLOG_TEST_DIR = path.resolve(path.join(__dirname, 'big-blog'));
  });
});
