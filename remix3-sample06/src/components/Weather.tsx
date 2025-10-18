import { type Remix } from "@remix-run/dom";
import { SSRFetch, useSSR } from "../provider/SSRProvider";
import { Link } from "../provider/RouterProvider";

interface Weather {
  publishingOffice: string;
  reportDatetime: Date;
  targetArea: string;
  headlineText: string;
  text: string;
}

export function Weather(this: Remix.Handle, { id }: { id: string }) {
  return (
    <SSRFetch
      name={`weather-${id}`}
      action={() =>
        fetch(
          `https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${id}.json`
        ).then((v) => v.json())
      }
    >
      <WeatherItem />
    </SSRFetch>
  );
}

function WeatherItem(this: Remix.Handle) {
  const { value ,state} = useSSR<Weather>(this);
  return (
    <div>
      <div>
        <Link href="/">戻る</Link>
      </div>
      {state==="loading" && <div>Loading...</div>}
      {value && (
        <>
          <h1>{value.targetArea}</h1>
          <div>{new Date(value.reportDatetime).toLocaleString()}</div>
          <div>{value.headlineText}</div>
          <pre>{value.text}</pre>
        </>
      )}
    </div>
  );
}
