import { type Remix } from "@remix-run/dom";
import { useRouter } from "./provider/RouterProvider";
import { route } from "./route";

export function App(this: Remix.Handle) {
  return useRouter(this, route);
}
