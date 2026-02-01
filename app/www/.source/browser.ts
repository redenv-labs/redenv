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
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "installation.mdx": () => import("../content/docs/installation.mdx?collection=docs"), "quickstart.mdx": () => import("../content/docs/quickstart.mdx?collection=docs"), "cli/commands.mdx": () => import("../content/docs/cli/commands.mdx?collection=docs"), "cli/overview.mdx": () => import("../content/docs/cli/overview.mdx?collection=docs"), "concepts/encryption.mdx": () => import("../content/docs/concepts/encryption.mdx?collection=docs"), "concepts/environments.mdx": () => import("../content/docs/concepts/environments.mdx?collection=docs"), "concepts/expansion.mdx": () => import("../content/docs/concepts/expansion.mdx?collection=docs"), "concepts/secrets.mdx": () => import("../content/docs/concepts/secrets.mdx?collection=docs"), "concepts/tokens.mdx": () => import("../content/docs/concepts/tokens.mdx?collection=docs"), "concepts/versioning.mdx": () => import("../content/docs/concepts/versioning.mdx?collection=docs"), "plugins/overview.mdx": () => import("../content/docs/plugins/overview.mdx?collection=docs"), "plugins/studio.mdx": () => import("../content/docs/plugins/studio.mdx?collection=docs"), "sdk/javascript.mdx": () => import("../content/docs/sdk/javascript.mdx?collection=docs"), "sdk/python.mdx": () => import("../content/docs/sdk/python.mdx?collection=docs"), }),
};
export default browserCollections;