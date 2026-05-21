import { type Handle } from "remix/ui";
import { SSRFetch, useSSR } from "../provider/SSRProvider";
import { Link, useParams } from "../provider/RouterProvider";

interface Weather {
  publishingOffice: string;
  reportDatetime: Date;
  targetArea: string;
  headlineText: string;
  text: string;
}

export default function (handle: Handle) {
  return () => {
    const { id } = useParams(handle);
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
  };
}

function WeatherItem(handle: Handle) {
  return () => {
    const { value, state } = useSSR<Weather>(handle);
    return (
      <div className="p-2">
        <div className="mb-4">
          <Link to="/" className="text-blue-500 hover:underline">戻る</Link>
        </div>
        {state === "loading" && <div>Loading...</div>}
        {value && (
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold mb-2">{value.targetArea}</h1>
            <div className="text-sm text-gray-500 mb-4">{new Date(value.reportDatetime).toLocaleString()}</div>
            <div className="font-semibold mb-2">{value.headlineText}</div>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">{value.text}</pre>
          </div>
        )}
      </div>
    );
  };
}
