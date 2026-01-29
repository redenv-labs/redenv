import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const config: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["typescript", "twoslash"],
};

const withMDX = createMDX();
export default withMDX(config);
