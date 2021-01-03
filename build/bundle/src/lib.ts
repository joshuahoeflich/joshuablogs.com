import path from "path";
import MarkdownIt from "markdown-it";
import meta from "markdown-it-meta";

export const PROJECT_ROOT = path.resolve(
  path.join(__dirname, "..", "..", "..")
);

interface MarkdownMeta {
  description: string;
  title: string;
}

export const extractMetadata = (markdown: string): MarkdownMeta => {
  const md: any = new MarkdownIt();
  md.use(meta);
  md.render(markdown);
  return md.meta;
};
