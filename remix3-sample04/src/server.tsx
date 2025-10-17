import { Hono } from "hono";
import { renderToStream } from "@remix-run/dom/server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Layout } from "./root";

const app = new Hono();
app.get("/", () => {
  return new Response(renderToStream(<Layout />), {
    headers: {
      "Content-Type": "text/html",
    },
  });
});
app.use("/*", serveStatic({ root: "./public" }));

if (import.meta.url.endsWith(".js")) console.log("http://localhost:3000");

export default app;
