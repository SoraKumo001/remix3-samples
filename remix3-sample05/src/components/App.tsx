import { type Remix } from "@remix-run/dom";
import { AreaList } from "./AreaList";
import { useLocation } from "../RouterProvider";
import { Weather } from "./Weather";

export function App(this: Remix.Handle) {
  return () => {
    const location = useLocation(this);
    const match = location.match(/\/weather\/(\d+)/);
    const id = match?.[1];
    return !id ? <AreaList /> : <Weather id={id} />;
  };
}
