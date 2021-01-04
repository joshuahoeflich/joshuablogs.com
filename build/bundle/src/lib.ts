import fs, { mkdirp, remove, copy } from "fs-extra";
import path from "path";
import MarkdownIt from "markdown-it";
import meta from "markdown-it-meta";

export interface MarkdownContent {
  title: string;
  description: string;
  content: string;
}

export interface NavLink {
  slug: string;
  title: string;
}

export interface BlogMeta {
  previous: NavLink | null;
  next: NavLink | null;
  slug: string;
}

export type BlogContext = BlogMeta & MarkdownContent;

export interface BlogIndex {
  title: string;
  description: string;
  slug: string;
}

export interface IndexContext {
  pageNumber: number;
  blogs: Array<BlogIndex>;
  numPages: number;
}

export interface HtmlOutput {
  blogPath: string;
  htmlPath: string;
}

export interface StaticFileConfig {
  htmlPath: string;
  staticFilePath: string;
}

export interface BlogConfig {
  blogPath: string;
  htmlPath: string;
  staticFilePath: string;
}

export interface BlogIndexConfig {
  blogsPerPage: number;
  blogs: Array<BlogContext>;
}

export const PROJECT_ROOT = path.resolve(
  path.join(__dirname, "..", "..", "..")
);

const indexInBounds = <T>(index: number, array: Array<T>): boolean =>
  index >= 0 && index < array.length;

export const extractMarkdownContents = (markdown: string): MarkdownContent => {
  const md: any = new MarkdownIt().use(meta);
  const content = md.render(markdown);
  return {
    ...md.meta,
    content,
  };
};

export const renderPostFooter = (blogContext: BlogContext): string => {
  const previous = blogContext.previous
    ? `<a href="${blogContext.previous.slug}">👈 ${blogContext.previous.title}</a>`
    : "";
  const next = blogContext.next
    ? `<a href="${blogContext.next.slug}">👉 ${blogContext.next.title}</a>`
    : "";
  return `${previous}<a href="/">🏠 Home</a>${next}`;
};

export const renderBlogPost = (blogContext: BlogContext): string => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content="Joshua Hoeflich's blog." />
    <link
      rel="preload"
      crossorigin="anonymous"
      href="/styles/roboto.woff"
      as="font"
    />
    <link
      rel="preload"
      crossorigin="anonymous"
      href="/styles/roboto-slab.woff"
      as="font"
    />
    <link rel="preload" href="/styles/style.css" as="style" />
    <title>Joshua Blogs | ${blogContext.title}</title>
    <link rel="stylesheet" href="/styles/style.css" />
  </head>
  <body>
    <div class="page-container">
      <div class="card" id="blog-post">
        ${blogContext.content}
      </div>
      <div class="card" id="nav">
        ${renderPostFooter(blogContext)}
      </div>
    </div>
  </body>
</html>
  `;
};

export const renderBlogCard = (blog: BlogIndex, index: number): string => `
<div class="card">
  <a class="page-link" href="${blog.slug}">
    ${index === 0 ? `<h1>${blog.title}</h1>` : `<h2>${blog.title}</h2>`}
    <p>${blog.description}</p>
  </a>
</div>`;

export const renderIndexFooter = (ctx: IndexContext): string => {
  const { pageNumber, numPages } = ctx;
  const previous =
    pageNumber > 1
      ? `<a href="/${pageNumber - 1 > 1 ? pageNumber - 1 : ""}">👈 Previous</a>`
      : "";
  const next =
    pageNumber < numPages ? `<a href="/${pageNumber + 1}">👉 Next</a>` : "";
  return `${previous}<a href="/about">🐛 About</a><a href="/apps">🎈 Apps</a>${next}`;
};

export const renderBlogIndex = (ctx: IndexContext): string => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content="Joshua Hoeflich's blog." />
    <link
      rel="preload"
      crossorigin="anonymous"
      href="/styles/roboto.woff"
      as="font"
    />
    <link
      rel="preload"
      crossorigin="anonymous"
      href="/styles/roboto-slab.woff"
      as="font"
    />
    <link rel="preload" href="/styles/style.css" as="style" />
    <title>Joshua Blogs</title>
    <link rel="stylesheet" href="/styles/style.css" />
  </head>
  <body>
    <div class="page-container">
      ${ctx.blogs.map(renderBlogCard).join("\n")}
      <div id="nav" class="card">
        ${renderIndexFooter(ctx)}
      </div>
    </div>
  </body>
  `;
};

const getNavLink = (
  index: number,
  blogArray: MarkdownContent[],
  slugArray: string[]
): null | NavLink =>
  indexInBounds(index, blogArray)
    ? {
        slug: slugArray[index],
        title: blogArray[index].title,
      }
    : null;


export const getBlogSlug = (filePath: string): string => {
  const baseName = path.parse(filePath).name;
  return `/${baseName.slice(baseName.indexOf("-") + 1)}`;
};

export const getBlogContexts = async (
  blogPath: string
): Promise<Array<BlogContext>> => {
  const blogPaths = (await fs.promises.readdir(blogPath)).map((postName) =>
    path.resolve(path.join(blogPath, postName))
  ).reverse();
  const blogSlugs = blogPaths.map(getBlogSlug);
  const blogPosts = await Promise.all(
    blogPaths.map(async (el) => {
      const markdownContent = await fs.promises.readFile(el, "utf-8");
      return extractMarkdownContents(markdownContent);
    })
  );
  return blogPosts.map((el, index) => ({
    ...el,
    previous: getNavLink(index - 1, blogPosts, blogSlugs),
    next: getNavLink(index + 1, blogPosts, blogSlugs),
    slug: blogSlugs[index],
  }));
};

export const indexBlogs = (config: BlogIndexConfig): Array<IndexContext> => {
  const { blogs, blogsPerPage } = config;
  const numPages = Math.ceil(blogs.length / blogsPerPage);
  return Array.from({ length: numPages })
    .map((_, i) => {
      const start = i * blogsPerPage;
      return blogs.slice(start, start + blogsPerPage);
    })
    .map((contexts, index) => ({
      pageNumber: index + 1,
      numPages,
      blogs: contexts.map((blog) => ({
        title: blog.title,
        description: blog.description,
        slug: blog.slug,
      })),
    }));
};

export const writeBlogPosts = (
  htmlPath: string,
  blogContexts: BlogContext[]
): Promise<void>[] => {
  return blogContexts.map(async (ctx) => {
    const outDir = path.resolve(path.join(htmlPath, ctx.slug));
    await mkdirp(outDir);
    await fs.writeFile(path.join(outDir, "index.html"), renderBlogPost(ctx));
  });
};

export const writeBlogIndexes = (
  htmlPath: string,
  blogContexts: BlogContext[]
): Promise<void>[] => {
  const indexes = indexBlogs({ blogs: blogContexts, blogsPerPage: 10 });
  return indexes.map(async (blogIndex) => {
    const outDir = path.resolve(
      path.join(
        htmlPath,
        blogIndex.pageNumber > 1 ? `${blogIndex.pageNumber}` : ""
      )
    );
    await mkdirp(outDir);
    await fs.writeFile(
      path.join(outDir, "index.html"),
      renderBlogIndex(blogIndex)
    );
  });
};

export const copyStaticFiles = async (
  config: StaticFileConfig
): Promise<void[]> => {
  const { staticFilePath, htmlPath } = config;
  const filePaths = await fs.promises.readdir(staticFilePath);
  return Promise.all(
    filePaths.map((filePath) => {
      const absPath = path.resolve(path.join(staticFilePath, filePath));
      return copy(absPath, path.resolve(path.join(htmlPath, filePath)));
    })
  );
};

export const writeBlogHtml = async (htmlOutput: HtmlOutput): Promise<void> => {
  await remove(htmlOutput.htmlPath);
  const blogContexts = await getBlogContexts(htmlOutput.blogPath);
  await Promise.all([
    ...writeBlogPosts(htmlOutput.htmlPath, blogContexts),
    ...writeBlogIndexes(htmlOutput.htmlPath, blogContexts),
  ]);
};

export const generateBlog = async (config: BlogConfig) => {
  await writeBlogHtml(config);
  await copyStaticFiles(config);
}
