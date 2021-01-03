import fs from "fs-extra";
import path from "path";
import MarkdownIt from "markdown-it";
import meta from "markdown-it-meta";

export const PROJECT_ROOT = path.resolve(
  path.join(__dirname, "..", "..", "..")
);

export interface MarkdownContent {
  description: string;
  title: string;
  content: string;
}

const makeMarkdownExtractor = () => {
  const md: any = new MarkdownIt();
  md.use(meta);
  const extractMarkdownContents = (markdown: string): MarkdownContent => {
    const content = md.render(markdown);
    return {
      ...md.meta,
      content,
    };
  };
  return extractMarkdownContents;
};

export const extractMarkdownContents = makeMarkdownExtractor();

export interface BlogMeta {
  previous: string | null;
  next: string | null;
}

export type BlogContext = BlogMeta & MarkdownContent;

export const getBlogContexts = async (
  blogPath: string
): Promise<Array<BlogContext>> => {
  const blogPaths = await fs.promises.readdir(blogPath);
  const blogPosts = await Promise.all(
    blogPaths.map(async (el) => {
      const absolutePath = path.resolve(path.join(blogPath, el));
      const markdownContent = await fs.promises.readFile(absolutePath, "utf-8");
      return extractMarkdownContents(markdownContent);
    })
  );
  return blogPosts.map((el, index) => ({
    ...el,
    previous: blogPosts[index - 1]?.title || null,
    next: blogPosts[index + 1]?.title || null,
  }));
};

// const getNavFooter = (blogContext: BlogContext): string => {
//   return `${blogContext.previous ?  : ''}<a href="/">🏠 Home</a>${}`
// }

// export const renderBlog = (blogContext: BlogContext): string => {
//   return `
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width,initial-scale=1" />
//     <meta name="description" content="Joshua Hoeflich's blog." />
//     <link
//       rel="preload"
//       crossorigin="anonymous"
//       href="/styles/roboto.woff"
//       as="font"
//     />
//     <link
//       rel="preload"
//       crossorigin="anonymous"
//       href="/styles/roboto-slab.woff"
//       as="font"
//     />
//     <link rel="preload" href="/styles/style.css" as="style" />
//     <title>Joshua Blogs | ${blogContext.title}</title>
//     <link rel="stylesheet" href="/styles/style.css" />
//   </head>
//   <body>
//     <div class="page-container">
//       <div class="card" id="blog-post">
//         ${blogContext.content}
//       </div>
//       <div id="nav" class="card">
//         ${getNavFooter(blogContext)}
//       </div>
//     </div>
//   </body>
// </html>
//   `;
// }
