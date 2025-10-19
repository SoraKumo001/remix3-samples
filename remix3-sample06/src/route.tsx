import { AreaList } from "./components/AreaList";
import { Weather } from "./components/Weather";
import type { RouteType } from "./provider/RouterProvider";

export const route: RouteType = {
  "/": () => <AreaList />,
  "/weather/:id": ({ params }) => <Weather id={params.id} />,
};
