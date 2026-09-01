import { type Handle } from "remix/ui";
import { SSRFetch, useSSR } from "../SSRProvider";
import { Link } from "../RouterProvider";

interface WeatherData {
  publishingOffice: string;
  reportDatetime: Date;
  targetArea: string;
  headlineText: string;
  text: string;
}

export function Weather(handle: Handle<{ id: string }>) {
  return () => (
    <SSRFetch
      name={`weather-${handle.props.id}`}
      action={() =>
        fetch(
          `https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${handle.props.id}.json`,
        ).then((v) => v.json())
      }
    >
      <WeatherItem />
    </SSRFetch>
  );
}

function WeatherItem(handle: Handle) {
  return () => {
    const value = useSSR<WeatherData>(handle);
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
