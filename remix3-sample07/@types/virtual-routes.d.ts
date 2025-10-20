declare module "virtual:routes" {
  import { type Remix } from "@remix-run/dom";

  export const route: {
    [path: string]: Remix.Component;
  };
}
