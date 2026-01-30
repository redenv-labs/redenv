// @ts-nocheck
import * as __fd_glob_11 from "../content/docs/sdk/javascript/sami.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/sdk/javascript/sami copy.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/sdk/javascript/sami copy 4.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/sdk/javascript/sami copy 3.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/sdk/javascript/sami copy 2.mdx?collection=docs"
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

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "cli/meta.json": __fd_glob_1, "concepts/meta.json": __fd_glob_2, "plugins/meta.json": __fd_glob_3, "sdk/meta.json": __fd_glob_4, "plugins/studio/meta.json": __fd_glob_5, }, {"index.mdx": __fd_glob_6, "sdk/javascript/sami copy 2.mdx": __fd_glob_7, "sdk/javascript/sami copy 3.mdx": __fd_glob_8, "sdk/javascript/sami copy 4.mdx": __fd_glob_9, "sdk/javascript/sami copy.mdx": __fd_glob_10, "sdk/javascript/sami.mdx": __fd_glob_11, });