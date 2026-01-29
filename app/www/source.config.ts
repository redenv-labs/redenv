import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import { transformerTwoslash } from 'fumadocs-twoslash';

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash(),
      ],
      // important: Shiki doesn't support lazy loading languages for codeblocks in Twoslash popups
      // make sure to define them first (e.g. the common ones)
      langs: ["js", "jsx", "ts", "tsx"],
    },
  },
});
