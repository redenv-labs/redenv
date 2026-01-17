import { defineConfig } from "@redenv/core";
import { studioPlugin } from "../studio/dist";

export default defineConfig({
  environment: "development",
  name: "pras",
  plugins: [studioPlugin],
});

console.log(studioPlugin.name)