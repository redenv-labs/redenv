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
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "installation.mdx": () => import("../content/docs/installation.mdx?collection=docs"), "quickstart.mdx": () => import("../content/docs/quickstart.mdx?collection=docs"), "test-page.mdx": () => import("../content/docs/test-page.mdx?collection=docs"), "concepts/encryption.mdx": () => import("../content/docs/concepts/encryption.mdx?collection=docs"), "concepts/environments.mdx": () => import("../content/docs/concepts/environments.mdx?collection=docs"), "concepts/secrets.mdx": () => import("../content/docs/concepts/secrets.mdx?collection=docs"), "cli/commands.mdx": () => import("../content/docs/cli/commands.mdx?collection=docs"), "cli/overview.mdx": () => import("../content/docs/cli/overview.mdx?collection=docs"), "sdk/python.mdx": () => import("../content/docs/sdk/python.mdx?collection=docs"), "sdk/javascript/sami copy 2.mdx": () => import("../content/docs/sdk/javascript/sami copy 2.mdx?collection=docs"), "sdk/javascript/sami copy 3.mdx": () => import("../content/docs/sdk/javascript/sami copy 3.mdx?collection=docs"), "sdk/javascript/sami copy 4.mdx": () => import("../content/docs/sdk/javascript/sami copy 4.mdx?collection=docs"), "sdk/javascript/sami copy.mdx": () => import("../content/docs/sdk/javascript/sami copy.mdx?collection=docs"), "sdk/javascript/sami.mdx": () => import("../content/docs/sdk/javascript/sami.mdx?collection=docs"), }),
};
export default browserCollections;