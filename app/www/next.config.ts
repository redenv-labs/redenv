import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const config: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "*",
      },
    ],
  },
  serverExternalPackages: ["typescript", "twoslash"],
};

const withMDX = createMDX();
export default withMDX(config);
