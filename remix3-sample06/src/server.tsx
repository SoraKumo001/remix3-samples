import { Hono } from "hono";
import { renderToStream } from "@remix-run/dom/server";
import { Layout } from "./root";
import { resolveFrame, type SSRProps } from "./provider/SSRProvider";
import { RouterProvider } from "./provider/RouterProvider";

const app = new Hono();
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

if (typeof import.meta.url !== "undefined" && import.meta.url.endsWith(".js"))
  console.log("http://localhost:3000");

export default app;
