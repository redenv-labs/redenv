import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import { withFrontmatter } from "./plugins/frontmatter";

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

const withFM = withFrontmatter({
  dir: ["content/**/*"],
  frequency: 10,
});

const withMDX = createMDX();
export default withFM(withMDX(config));
