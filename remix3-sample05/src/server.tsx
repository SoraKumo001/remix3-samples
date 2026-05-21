import { Hono } from "hono";
import { renderToStream, renderToString } from "remix/ui/server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Layout } from "./root";
import { resolveFrame, type SSRProps } from "./SSRProvider";
import { RouterProvider } from "./RouterProvider";


const app = new Hono();
app.use("/*", serveStatic({ root: "./public" }));
app.get("*", async (c) => {
  const storage: SSRProps = { states: {} };
  return new Response(
    renderToStream(
      <RouterProvider url={c.req.url}>
        <Layout storage={storage} />
      </RouterProvider>,
      {
        resolveFrame: async (src) => {
          const node = await resolveFrame(src, storage.states);
          return renderToString(
            <RouterProvider url={c.req.url}>
              {node}
            </RouterProvider>
          );
        },
      }
    ),
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
});

if (import.meta.url.endsWith(".js")) console.log("http://localhost:3000");

export default app;
