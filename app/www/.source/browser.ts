// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
    docs: {
      /**
       * extracted references (e.g. hrefs, paths), useful for analyzing relationships between pages.
       */
      extractedReferences: import("fumadocs-mdx").ExtractedReference[];
    },
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "sdk/javascript/sami copy 2.mdx": () => import("../content/docs/sdk/javascript/sami copy 2.mdx?collection=docs"), "sdk/javascript/sami copy 3.mdx": () => import("../content/docs/sdk/javascript/sami copy 3.mdx?collection=docs"), "sdk/javascript/sami copy 4.mdx": () => import("../content/docs/sdk/javascript/sami copy 4.mdx?collection=docs"), "sdk/javascript/sami copy.mdx": () => import("../content/docs/sdk/javascript/sami copy.mdx?collection=docs"), "sdk/javascript/sami.mdx": () => import("../content/docs/sdk/javascript/sami.mdx?collection=docs"), }),
};
export default browserCollections;