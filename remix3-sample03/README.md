# remix3-sample03

## rolldown.config.ts

```ts
import { defineConfig } from "rolldown";
import { builtinModules } from "module";

export default [
  defineConfig({
    input: { bundle: "./src/client.tsx" },
    output: {
      dir: "public",
      entryFileNames: "[name].js",
    },
    resolve: {
      alias: {
        "react/jsx-runtime": "@remix-run/dom/jsx-runtime",
        "react/jsx-dev-runtime": "@remix-run/dom/jsx-dev-runtime",
      },
    },
  }),
  defineConfig({
    input: ["./src/server.tsx"],
    output: {
      dir: "dist",
      entryFileNames: "index.js",
    },
    external: (id) => builtinModules.includes(id),
    resolve: {
      alias: {
        "react/jsx-runtime": "@remix-run/dom/jsx-runtime",
        "react/jsx-dev-runtime": "@remix-run/dom/jsx-dev-runtime",
      },
    },
  }),
];
```

## src/server.tsx

```ts
import { Hono } from "hono";
import { renderToStream } from "@remix-run/dom/server";
import { Layout } from "./root";
import { serveStatic } from "@hono/node-server/serve-static";
import { jsx } from "@remix-run/dom/jsx-runtime";
import { serve } from "@hono/node-server";

const app = new Hono();
app.get("/", () => {
  return new Response(renderToStream(jsx(Layout, {})), {
    headers: {
      "Content-Type": "text/html",
    },
  });
});
app.use("*", serveStatic({ root: "./public" }));

serve(app);

console.log("http://localhost:3000");
```

## src/client.tsx

```ts
import { createRoot } from "@remix-run/dom";
import { App } from "./App";
if (document.body) {
  createRoot(document.body).render(<App />);
} else {
  window.addEventListener(
    "load",
    () => {
      console.log(document.body.innerHTML);
      createRoot(document.body).render(<App />);
    },
    { once: true }
  );
}
```
