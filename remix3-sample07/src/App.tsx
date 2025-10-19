import { type Remix } from "@remix-run/dom";
import { useRouter } from "./provider/RouterProvider";
import { route } from "virtual:routes";

export function App(this: Remix.Handle) {
  const Outlet = useRouter(this, route);
  return <Outlet />;
}
