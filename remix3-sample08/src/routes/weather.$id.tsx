import { type Handle } from "remix/ui";
import { Link } from "../provider/RouterProvider";

interface Weather {
  publishingOffice: string;
  reportDatetime: Date;
  targetArea: string;
  headlineText: string;
  text: string;
}

export const loader = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const res = await fetch(
    `https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${id}.json`
  );
  return res.json();
};

export default function (handle: Handle<{ loaderData?: Weather }>) {
  return () => {
    const loaderData = handle.props.loaderData;
    return (
      <div className="p-2">
        <div className="mb-4">
          <Link to="/" className="text-blue-500 hover:underline">
            戻る
          </Link>
        </div>
        {!loaderData && <div>Loading...</div>}
        {loaderData && (
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold mb-2">{loaderData.targetArea}</h1>
            <div className="text-sm text-gray-500 mb-4">
              {new Date(loaderData.reportDatetime).toLocaleString()}
            </div>
            <div className="font-semibold mb-2">{loaderData.headlineText}</div>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
              {loaderData.text}
            </pre>
          </div>
        )}
      </div>
    );
  };
}
