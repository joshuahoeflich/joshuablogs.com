import fs from "fs";
import path from "path";
import {
  getBlogContexts,
  extractMarkdownContents,
  PROJECT_ROOT,
  BlogContext,
  getBlogSlug,
  getNavFooter,
} from "./lib";

describe("Project root", () => {
  test("Points to the right directory", () => {
    expect(fs.readdirSync(PROJECT_ROOT).includes(".gitignore")).toBe(true);
  });
});

describe("Rendering the footer", () => {
  test("Works when no previous", () => {
    expect(
      getNavFooter({
        description: "",
        title: "",
        content: "",
        previous: null,
        slug: '',
        next: { title: "Hello!", slug: "/hello" },
      })
    ).toEqual('<a href="/">🏠 Home</a><a href="/hello">👉 Hello!</a>');
  });
  test("Works when no next", () => {
    expect(
      getNavFooter({
        description: "",
        title: "",
        content: "",
        slug: '',
        previous: { title: "Goodbye!", slug: "/goodbye"   },
        next: null,
      })
    ).toEqual('<a href="/goodbye">👈 Goodbye!</a><a href="/">🏠 Home</a>');
  });
  test("Works when previous and next both exist", () => {
    expect(
      getNavFooter({
        description: "",
        title: "",
        content: "",
        slug: '',
        previous: { title: "Goodbye!", slug: "/goodbye"   },
        next: { title: "Hello!", slug: "/hello" },
      })
    ).toEqual('<a href="/goodbye">👈 Goodbye!</a><a href="/">🏠 Home</a><a href="/hello">👉 Hello!</a>');
  });
});

describe("Markdown to HTML translation", () => {
  test("getBlogSlug can return the right slug from a file path", () => {
    expect(getBlogSlug("/000-file-path.md")).toEqual("/file-path");
    expect(getBlogSlug("/042-another-path.md")).toEqual("/another-path");
    expect(getBlogSlug("/242-hooray-long-path.md")).toEqual("/hooray-long-path");
  });
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
  let blogPaths: Array<string>;
  beforeAll(async () => {
    const EXAMPLE_BLOG_TEST_DIR = path.resolve(
      path.join(__dirname, "..", "integration","example-blog")
    );
    blogs = await getBlogContexts(EXAMPLE_BLOG_TEST_DIR);
    blogPaths = fs.readdirSync(EXAMPLE_BLOG_TEST_DIR);
  });
  test("We can find all the blogs in our mock project", async () => {
    expect(blogs.length).toEqual(1000);
  });
  test("Blogs have a correct previous and next", () => {
    expect(blogs[0].previous).toEqual(null);
    expect(blogs[0].next).toStrictEqual({
      title: blogs[1].title,
      slug: getBlogSlug(blogPaths[1]),
    });
    expect(blogs[999].next).toEqual(null);
    expect(blogs[999].previous).toStrictEqual({
      title: blogs[998].title,
      slug: getBlogSlug(blogPaths[998]),
    });
    expect(blogs[234].next).toEqual({
      title: blogs[235].title,
      slug: getBlogSlug(blogPaths[235]),
    });
    expect(blogs[234].previous).toEqual({
      title: blogs[233].title,
      slug: getBlogSlug(blogPaths[233]),
    });
  });
});
