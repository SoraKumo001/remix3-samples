import Index from "./pages/index";
import Weather from "./pages/weather";
import type { RouteType } from "./provider/RouterProvider";

export const route: RouteType = {
  "/": () => <Index />,
  "/weather/:id": () => <Weather />,
};
