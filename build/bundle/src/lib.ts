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

export const getBlogPosition = (fileName: string): number =>
  Number.parseInt(fileName.split("_")[0], 10);
