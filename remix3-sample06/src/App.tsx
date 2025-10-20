import { type Remix } from "@remix-run/dom";
import { Outlet } from "./provider/RouterProvider";

export function App(this: Remix.Handle) {
  return <Outlet />;
}
