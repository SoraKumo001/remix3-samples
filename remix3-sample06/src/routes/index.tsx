import { type Handle } from "remix/ui";
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

export default function (handle: Handle) {
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
    const { value, state } = useSSR<Area>(handle);
    return (
      <div className="p-2">
        {state === "loading" && <div>Loading...</div>}
        {value &&
          Object.entries(value.offices).map(([code, { name }]) => (
            <div key={code}>
              <Link to={`/weather/${code}`}>{name}</Link>
            </div>
          ))}
      </div>
    );
  };
}
