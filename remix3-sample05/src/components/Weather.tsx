import { type Remix } from "@remix-run/dom";
import { SSRFetch, useSSR } from "../SSRProvider";
import { Link } from "../RouterProvider";

interface Weather {
  publishingOffice: string;
  reportDatetime: Date;
  targetArea: string;
  headlineText: string;
  text: string;
}

export function Weather(this: Remix.Handle) {
  return ({ id }: { id: string }) => (
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
  return () => {
    const value = useSSR<Weather>(this);
    return (
      <div>
        <div>
          <Link to="/">戻る</Link>
        </div>
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
  };
}
