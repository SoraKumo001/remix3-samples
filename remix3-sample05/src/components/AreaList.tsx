import { type Handle } from "remix/ui";
import { SSRFetch, useSSR } from "../SSRProvider";
import { Link } from "../RouterProvider";

interface Center {
  name: string;
  enName: string;
  officeName?: string;
  children?: string[];
  parent?: string;
  kana?: string;
}
interface Centers {
  [key: string]: Center;
}
interface Area {
  centers: Centers;
  offices: Centers;
  class10s: Centers;
  class15s: Centers;
  class20s: Centers;
}

export function AreaList(_handle: Handle) {
  return () => (
    <SSRFetch
      name="area-list"
      action={() =>
        fetch("https://www.jma.go.jp/bosai/common/const/area.json").then((v) =>
          v.json()
        )
      }
    >
      <List />
    </SSRFetch>
  );
}

function List(handle: Handle) {
  return () => {
    const value = useSSR<Area>(handle);
    return (
      value &&
      Object.entries(value.offices).map(([code, { name }]) => (
        <div key={code}>
          <Link to={`/weather/${code}`}>{name}</Link>
        </div>
      ))
    );
  };
}
