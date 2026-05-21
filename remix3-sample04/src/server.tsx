import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import { renderToStream } from "remix/ui/server";
import { Layout } from "./root.tsx";

const app = new Hono();

// Serve static files from public directory
app.use("/*", serveStatic({ root: "./public" }));

app.get("*", async (c) => {
  return new Response(
    renderToStream(
      <Layout />,

      // {
      //   resolveFrame: (src) => resolveFrame(src, storage.states),
      // }
    ),
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
});

if (import.meta.url.endsWith(".js")) console.log("http://localhost:3000");

export default app;
