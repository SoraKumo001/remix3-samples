import { renderToStream } from "@remix-run/dom/server";
import { Layout } from "./root";
import { resolveFrame, type SSRProps } from "./provider/SSRProvider";
import { RouterProvider } from "./provider/RouterProvider";

const handler = (url: string) => {
  const storage: SSRProps = { states: {} };
  return new Response(
    renderToStream(
      <RouterProvider url={url}>
        <Layout storage={storage} />
      </RouterProvider>,
      {
        resolveFrame: (src) => resolveFrame(src, storage.states),
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
