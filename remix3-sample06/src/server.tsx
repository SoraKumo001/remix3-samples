import { renderToStream, renderToString } from "remix/ui/server";
import { Layout } from "./root";
import {
  resolveFrame,
  SSRProvider,
  type SSRProps,
} from "./provider/SSRProvider";
import { RouterProvider } from "./provider/RouterProvider";

const handler = (url: string) => {
  const storage: SSRProps = { states: {} };
  const routerContext = {
    serverUrl: url,
    navigate: () => {},
  };

  return new Response(
    renderToStream(
      <RouterProvider value={routerContext}>
        <Layout storage={storage} />
      </RouterProvider>,

      {
        resolveFrame: (src) =>
          resolveFrame(src, storage.states, (node) =>
            renderToString(
              <RouterProvider value={routerContext}>{node}</RouterProvider>,
            ),
          ),
      },
    ),
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
};

export default handler;
