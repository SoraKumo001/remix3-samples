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
  }),
  defineConfig({
    input: ["./src/server.tsx"],
    output: {
      dir: "dist",
      entryFileNames: "index.js",
    },
    external: (id) => id.startsWith("node:") || builtinModules.includes(id),
  }),
];
```

## src/server.tsx

```tsx
import { Hono } from "hono";
import { renderToStream } from "remix/ui/server";
import { Layout } from "./root.tsx";
import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";

const app = new Hono();
app.get("/", () => {
  return new Response(renderToStream(<Layout />), {
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

```tsx
import { createRoot } from "remix/ui";
import { App } from "./App.tsx";

if (document.body) {
  createRoot(document.body).render(<App />);
} else {
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      createRoot(document.body).render(<App />);
    },
    { once: true }
  );
}
```
