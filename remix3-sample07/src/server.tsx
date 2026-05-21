import { renderToString, renderToStream } from "remix/ui/server";
import { Layout } from "./root";
import {
  resolveFrame,
  SSRProvider,
  type SSRProps,
} from "./provider/SSRProvider";
import { RouterProvider } from "./provider/RouterProvider";

const handler = (url: string) => {
  const storage: SSRProps = { states: {} };
  return new Response(
    renderToStream(
      <RouterProvider url={url}>
        <SSRProvider storage={storage}>
          <Layout />
        </SSRProvider>
      </RouterProvider>,
      {
        resolveFrame: async (src) => {
          const node = await resolveFrame(src, storage.states);
          if (!node) return undefined;
          return renderToString(<RouterProvider url={url}>{node}</RouterProvider>);
        },
      }
    ),
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
};

export default handler;
