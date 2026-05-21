import { type Handle } from "remix/ui";
import { Outlet } from "./provider/RouterProvider";

export function App(handle: Handle) {
  return () => <Outlet />;
}
