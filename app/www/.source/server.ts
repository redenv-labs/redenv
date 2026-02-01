// @ts-nocheck
import * as __fd_glob_20 from "../content/docs/sdk/python.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/sdk/javascript.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/plugins/studio.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/plugins/overview.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/concepts/versioning.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/concepts/tokens.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/concepts/secrets.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/concepts/expansion.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/concepts/environments.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/concepts/encryption.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/cli/overview.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/cli/commands.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/quickstart.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/installation.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_5 } from "../content/docs/plugins/studio/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/sdk/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/plugins/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/concepts/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/cli/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
    docs: {
      /**
       * extracted references (e.g. hrefs, paths), useful for analyzing relationships between pages.
       */
      extractedReferences: import("fumadocs-mdx").ExtractedReference[];
    },
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "cli/meta.json": __fd_glob_1, "concepts/meta.json": __fd_glob_2, "plugins/meta.json": __fd_glob_3, "sdk/meta.json": __fd_glob_4, "plugins/studio/meta.json": __fd_glob_5, }, {"index.mdx": __fd_glob_6, "installation.mdx": __fd_glob_7, "quickstart.mdx": __fd_glob_8, "cli/commands.mdx": __fd_glob_9, "cli/overview.mdx": __fd_glob_10, "concepts/encryption.mdx": __fd_glob_11, "concepts/environments.mdx": __fd_glob_12, "concepts/expansion.mdx": __fd_glob_13, "concepts/secrets.mdx": __fd_glob_14, "concepts/tokens.mdx": __fd_glob_15, "concepts/versioning.mdx": __fd_glob_16, "plugins/overview.mdx": __fd_glob_17, "plugins/studio.mdx": __fd_glob_18, "sdk/javascript.mdx": __fd_glob_19, "sdk/python.mdx": __fd_glob_20, });