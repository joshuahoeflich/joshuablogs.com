import fs, { mkdirp, remove } from "fs-extra";
import path from "path";
import MarkdownIt from "markdown-it";
import meta from "markdown-it-meta";

export interface MarkdownDescription {
  title: string;
  description: string;
}

export interface MarkdownHtml {
  content: string;
}

export type MarkdownContent = MarkdownDescription & MarkdownHtml;

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

export interface IndexContext {
  pageNumber: number;
  blogs: Array<MarkdownDescription>;
}

export interface HtmlOutput {
  blogPath: string;
  htmlPath: string;
}

export interface BlogIndexConfig {
  blogsPerPage: number;
  blogs: Array<BlogContext>;
}

export const PROJECT_ROOT = path.resolve(
  path.join(__dirname, "..", "..", "..")
);

export const extractMarkdownContents = (markdown: string): MarkdownContent => {
  const md: any = new MarkdownIt().use(meta);
  const content = md.render(markdown);
  return {
    ...md.meta,
    content,
  };
};

export const getBlogSlug = (filePath: string): string => {
  const baseName = path.parse(filePath).name;
  return `/${baseName.slice(baseName.indexOf("-") + 1)}`;
};

const indexInBounds = <T>(index: number, array: Array<T>): boolean =>
  index >= 0 && index < array.length;

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

export const getBlogContexts = async (
  blogPath: string
): Promise<Array<BlogContext>> => {
  const blogPaths = (await fs.promises.readdir(blogPath)).map((postName) =>
    path.resolve(path.join(blogPath, postName))
  );
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

export const getNavFooter = (blogContext: BlogContext): string => {
  const previous = blogContext.previous
    ? `<a href="${blogContext.previous.slug}">👈 ${blogContext.previous.title}</a>`
    : "";
  const next = blogContext.next
    ? `<a href="${blogContext.next.slug}">👉 ${blogContext.next.title}</a>`
    : "";
  return `${previous}<a href="/">🏠 Home</a>${next}`;
};

export const renderBlog = (blogContext: BlogContext): string => {
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
      <div id="nav" class="card">
        ${getNavFooter(blogContext)}
      </div>
    </div>
  </body>
</html>
  `;
};

export const writeBlogHtml = async (htmlOutput: HtmlOutput): Promise<void> => {
  const [blogContexts] = await Promise.all([
    getBlogContexts(htmlOutput.blogPath),
    remove(htmlOutput.htmlPath),
  ]);
  const outputStrings = blogContexts.map(renderBlog);
  await Promise.all(
    blogContexts.map(async (ctx, index) => {
      const outDir = path.resolve(path.join(htmlOutput.htmlPath, ctx.slug));
      await mkdirp(outDir);
      await fs.writeFile(path.join(outDir, "index.html"), outputStrings[index]);
    })
  );
};

export const indexBlogs = (config: BlogIndexConfig): Array<IndexContext> => {
  const { blogsPerPage } = config;
  return Array.from({ length: blogsPerPage })
    .map((_, i) => {
      const start = i * blogsPerPage;
      return config.blogs.slice(start, start + blogsPerPage);
    })
    .map((blogs, index) => ({
      pageNumber: index + 1,
      blogs: blogs.map((blog) => ({
        title: blog.title,
        description: blog.description,
      })),
    }));
};
