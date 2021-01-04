import fs from "fs-extra";
import path from "path";
import MarkdownIt from "markdown-it";
import meta from "markdown-it-meta";

export interface MarkdownContent {
  description: string;
  title: string;
  content: string;
}

export interface NavLink {
  slug: string;
  title: string;
}

export interface BlogMeta {
  previous: NavLink | null;
  next: NavLink | null;
}

export type BlogContext = BlogMeta & MarkdownContent;

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

export const getBlogSlug = (filePath: string): string =>
  `/${path.parse(filePath.slice(filePath.indexOf("-") + 1)).name}`;

const indexInBounds = <T>(index: number, array: Array<T>): boolean =>
  index >= 0 && index < array.length;

const getNavLink = (
  index: number,
  blogArray: MarkdownContent[],
  pathArray: string[]
): null | NavLink =>
  indexInBounds(index, blogArray)
    ? {
        slug: getBlogSlug(path.parse(pathArray[index]).name),
        title: blogArray[index].title,
      }
    : null;

export const getBlogContexts = async (
  blogPath: string
): Promise<Array<BlogContext>> => {
  const blogPaths = (await fs.promises.readdir(blogPath)).map((postName) =>
    path.resolve(path.join(blogPath, postName))
  );
  const blogPosts = await Promise.all(
    blogPaths.map(async (el) => {
      const markdownContent = await fs.promises.readFile(el, "utf-8");
      return extractMarkdownContents(markdownContent);
    })
  );
  return blogPosts.map((el, index) => ({
    ...el,
    previous: getNavLink(index - 1, blogPosts, blogPaths),
    next: getNavLink(index + 1, blogPosts, blogPaths),
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
}

export const writeBlogHtml = async (blogPath: string): Promise<void> => {
  const blogContexts = await getBlogContexts(blogPath);
  blogContexts.map(renderBlog);
  console.log(blogContexts);
}
