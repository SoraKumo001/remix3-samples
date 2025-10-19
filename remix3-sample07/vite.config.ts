import { defineConfig, type ViteDevServer } from "vite";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import { remixRoutes } from "./vite-plugin/remix-routes";
import * as path from "path";
import wasmImageOptimizationPlugin from "wasm-image-optimization/vite-plugin";

export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      outDir: isSsrBuild ? "./dist" : "./dist/assets",
      ssr: isSsrBuild,
      rollupOptions: {
        input: isSsrBuild ? "./src/server.tsx" : "./src/client.tsx",
        output: {
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === "server") {
              return "index.js";
            }
            return "[name].js";
          },
        },
      },
    },
    publicDir: isSsrBuild ? false : undefined,
    plugins: [
      devServer({
        entry: "worker/app.ts",
        exclude: [...defaultOptions.exclude, /\.(ts|tsx|webp|png|svg)(\?.*)?$/],
      }),
      {
        name: "reload",
        handleHotUpdate({ server }: { server: ViteDevServer }) {
          server.moduleGraph.getModuleByUrl("/src/client.tsx").then((mod) => {
            if (mod) server.reloadModule(mod);
          });
        },
      },
      tailwindcss(),
      remixRoutes(),
      isSsrBuild ? undefined : wasmImageOptimizationPlugin(),
    ],
    resolve: {
      alias: {
        "../dist/index.js": "./src/server.tsx",
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
