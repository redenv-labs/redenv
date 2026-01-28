import type { NProgressOptions } from "nprogress";

declare module "nprogress" {
  interface NProgress extends NProgressOptions {
    setColor(color: string): void;
  }
}
