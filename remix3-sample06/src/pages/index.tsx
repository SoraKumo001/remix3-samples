import { type Remix } from "@remix-run/dom";
import { SSRFetch, useSSR } from "../provider/SSRProvider";
import { Link } from "../provider/RouterProvider";

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

export default function (this: Remix.Handle) {
  return (
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
  const { value, state } = useSSR<Area>(this);
  return (
    <div className="p-2">
      {state === "loading" && <div>Loading...</div>}
      {value &&
        Object.entries(value.offices).map(([code, { name }]) => (
          <div key={code}>
            <Link href={`/weather/${code}`}>{name}</Link>
          </div>
        ))}
    </div>
  );
}
