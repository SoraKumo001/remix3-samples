import { type Remix } from "@remix-run/dom";
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

export function AreaList(this: Remix.Handle) {
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

function List(this: Remix.Handle) {
  return () => {
    const value = useSSR<Area>(this);
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
