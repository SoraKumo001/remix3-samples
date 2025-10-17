import { Hono } from "hono";
import { renderToStream } from "@remix-run/dom/server";
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
        resolveFrame: (src) => resolveFrame(src, storage.states),
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
