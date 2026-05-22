import { type Handle } from "remix/ui";
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

export const loader = async () => {
  const res = await fetch("https://www.jma.go.jp/bosai/common/const/area.json");
  return res.json();
};

export default function (handle: Handle<{ loaderData?: Area }>) {
  return () => {
    const loaderData = handle.props.loaderData;
    return (
      <div className="p-2">
        {!loaderData && <div>Loading...</div>}
        {loaderData &&
          Object.entries(loaderData.offices).map(([code, { name }]) => (
            <div key={code}>
              <Link to={`/weather/${code}`}>{name}</Link>
            </div>
          ))}
      </div>
    );
  };
}
