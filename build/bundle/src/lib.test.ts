import fs from "fs";
import path from "path";
import {
  getBlogContexts,
  extractMarkdownContents,
  PROJECT_ROOT,
  BlogContext,
  getBlogSlug,
  renderPostFooter,
  renderBlogCard,
  indexBlogs,
  renderIndexFooter,
} from "./lib";

let blogs: Array<BlogContext>;
let blogPaths: Array<string>;

beforeAll(async () => {
  const EXAMPLE_BLOG_TEST_DIR = path.resolve(
    path.join(__dirname, "..", "integration", "example-blog")
  );
  blogs = await getBlogContexts(EXAMPLE_BLOG_TEST_DIR);
  blogPaths = fs.readdirSync(EXAMPLE_BLOG_TEST_DIR);
});

describe("Project root", () => {
  test("Points to the right directory", () => {
    expect(fs.readdirSync(PROJECT_ROOT).includes(".gitignore")).toBe(true);
  });
});

describe("Rendering the footer", () => {
  test("Works when no previous", () => {
    expect(
      renderPostFooter({
        description: "",
        title: "",
        content: "",
        previous: null,
        slug: "",
        next: { title: "Hello!", slug: "/hello" },
      })
    ).toEqual('<a href="/">🏠 Home</a><a href="/hello">👉 Hello!</a>');
  });
  test("Works when no next", () => {
    expect(
      renderPostFooter({
        description: "",
        title: "",
        content: "",
        slug: "",
        previous: { title: "Goodbye!", slug: "/goodbye" },
        next: null,
      })
    ).toEqual('<a href="/goodbye">👈 Goodbye!</a><a href="/">🏠 Home</a>');
  });
  test("Works when previous and next both exist", () => {
    expect(
      renderPostFooter({
        description: "",
        title: "",
        content: "",
        slug: "",
        previous: { title: "Goodbye!", slug: "/goodbye" },
        next: { title: "Hello!", slug: "/hello" },
      })
    ).toEqual(
      '<a href="/goodbye">👈 Goodbye!</a><a href="/">🏠 Home</a><a href="/hello">👉 Hello!</a>'
    );
  });
});

describe("Markdown to HTML translation", () => {
  test("getBlogSlug can return the right slug from a file path", () => {
    expect(getBlogSlug("/000-file-path.md")).toEqual("/file-path");
    expect(getBlogSlug("/042-another-path.md")).toEqual("/another-path");
    expect(getBlogSlug("/242-hooray-long-path.md")).toEqual(
      "/hooray-long-path"
    );
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

describe("Indexing pages", () => {
  test("Can get an array of the right pages", () => {
    expect(indexBlogs({ blogs, blogsPerPage: 10 }).length).toEqual(
      blogs.length / 10
    );
  });
  test("Maps out the page numbers correctly", () => {
    expect(
      indexBlogs({ blogs, blogsPerPage: 10 }).map((el) => el.pageNumber)
    ).toStrictEqual(Array.from({ length: 100 }).map((_, i) => i + 1));
  });
  test("Renders the first blog card correctly", () => {
    expect(
      renderBlogCard(
        {
          description: "description",
          title: "test",
          slug: "/this-is-a-slug",
        },
        0
      )
    ).toEqual(`
<div class="card">
  <a class="page-link" href="/this-is-a-slug">
    <h1>test</h1>
    <p>description</p>
  </a>
</div>`);
  });
  test("Renders the other blog cards correctly", () => {
    expect(
      renderBlogCard(
        {
          description: "description",
          title: "test",
          slug: "/this-is-a-slug",
        },
        3
      )
    ).toEqual(`
<div class="card">
  <a class="page-link" href="/this-is-a-slug">
    <h2>test</h2>
    <p>description</p>
  </a>
</div>`);
  });
  test("Renders the first footer correctly", () => {
    expect(
      renderIndexFooter({ blogs: [], pageNumber: 1, numPages: 10 })
    ).toEqual(
      `<a href="/about">🐛 About</a><a href="/apps">🎈 Apps</a><a href="/2">👉 Next</a>`
    );
  });
  test("Renders the second footer correctly", () => {
    expect(
      renderIndexFooter({ blogs: [], pageNumber: 2, numPages: 10 })
    ).toEqual(
      `<a href="/">👈 Previous</a><a href="/about">🐛 About</a><a href="/apps">🎈 Apps</a><a href="/3">👉 Next</a>`
    );
  });
  test("Renders the last footer correctly", () => {
    expect(
      renderIndexFooter({ blogs: [], pageNumber: 10, numPages: 10 })
    ).toEqual(
      `<a href="/9">👈 Previous</a><a href="/about">🐛 About</a><a href="/apps">🎈 Apps</a>`
    );
  });
  test("Renders in between footers correctly", () => {
    expect(
      renderIndexFooter({ blogs: [], pageNumber: 5, numPages: 10 })
    ).toEqual(
      `<a href="/4">👈 Previous</a><a href="/about">🐛 About</a><a href="/apps">🎈 Apps</a><a href="/6">👉 Next</a>`
    );
  });
  test("Handles the case where there is only one page correctly", () => {
    expect(
      renderIndexFooter({ blogs: [], pageNumber: 1, numPages: 1 })
    ).toEqual(`<a href="/about">🐛 About</a><a href="/apps">🎈 Apps</a>`);
  });
});

describe("File system interactions", () => {
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
