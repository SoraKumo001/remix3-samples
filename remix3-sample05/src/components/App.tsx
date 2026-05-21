import { type Handle } from "remix/ui";
import { AreaList } from "./AreaList";
import { useLocation } from "../RouterProvider";
import { Weather } from "./Weather";

export function App(handle: Handle) {
  return () => {
    const location = useLocation(handle);
    const match = location.match(/\/weather\/(\d+)/);
    const id = match?.[1];
    return !id ? <AreaList /> : <Weather id={id} />;
  };
}
