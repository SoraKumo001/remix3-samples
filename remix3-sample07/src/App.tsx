import type { Handle } from "@remix-run/component";
import { useRouter } from "./provider/RouterProvider";
import { route } from "virtual:routes";

export function App(this: Handle) {
  const Outlet = useRouter(this, route);
  return <Outlet />;
}
