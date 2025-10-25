import { defineConfig, type ViteDevServer } from "vite";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import { remixRoutes } from "./vite-plugin/remix-routes";
import wasmImageOptimizationPlugin from "wasm-image-optimization/vite-plugin";

export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      outDir: isSsrBuild ? "./dist" : "./dist/assets",
      ssr: isSsrBuild,
      rolldownOptions: {
        input: isSsrBuild ? "./worker/app.ts" : "./src/client.tsx",
        output: {
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === "app") {
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
        exclude: [
          ...defaultOptions.exclude,
          /\.(ts|tsx|webp|png|svg|css)(\?.*)?$/,
        ],
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
      wasmImageOptimizationPlugin(),
    ],
  };
});
