import { defineConfig } from "@redenv/core";
import { studioPlugin } from "../studio/src";

export default defineConfig({
  environment: "development",
  name: "pras",
  plugins: [studioPlugin],
});
