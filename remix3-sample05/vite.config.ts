import { defineConfig } from "vite";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import build from "@hono/vite-build/node";

export default defineConfig({
  plugins: [
    build({
      entry: "./src/server.tsx",
    }),
    devServer({
      entry: "src/server.tsx",
      exclude: [...defaultOptions.exclude, /\.(ts|tsx|webp|png|svg)(\?.*)?$/],
    }),
    {
      name: "reload",
      handleHotUpdate({ server }) {
        server.moduleGraph.getModuleByUrl("/src/client.tsx").then((mod) => {
          if (mod) server.reloadModule(mod);
        });
      },
    },
  ],
  base: "./",
  resolve: {
    alias: {
      "react/jsx-runtime": "@remix-run/dom/jsx-runtime",
      "react/jsx-dev-runtime": "@remix-run/dom/jsx-dev-runtime",
    },
  },
});
