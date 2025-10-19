import Index from "./routes/index";
import Weather from "./routes/weather.$id";
import type { RouteType } from "./provider/RouterProvider";

export const route: RouteType = {
  "/": () => <Index />,
  "/weather/:id": () => <Weather />,
};
