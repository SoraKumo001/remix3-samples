import { defineConfig } from "vite";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["./src/server.tsx"],
      name: "server",
      fileName: "index",
      formats: ["es"],
    },
  },
  plugins: [
    devServer({
      entry: "worker/app.ts",
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
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "../dist/index.js": "./src/server.tsx",
      "react/jsx-runtime": "@remix-run/dom/jsx-runtime",
      "react/jsx-dev-runtime": "@remix-run/dom/jsx-dev-runtime",
    },
  },
});
