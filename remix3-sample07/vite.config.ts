import { defineConfig, type ViteDevServer } from "vite";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import { remixRoutes } from "./vite-plugin/remix-routes";
import wasmImageOptimizationPlugin from "wasm-image-optimization/vite-plugin";

import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const workerLibMain = require.resolve("worker-lib");
const workerLibNodeEsm = path.resolve(
  path.dirname(workerLibMain),
  "../esm/node.js",
);
const workerLibBrowserEsm = path.resolve(
  path.dirname(workerLibMain),
  "../esm/index.js",
);

function workerLibPlugin() {
  return {
    name: "worker-lib-resolver",
    enforce: "pre" as const,
    resolveId(
      source: string,
      _importer: string | undefined,
      options?: { ssr?: boolean },
    ) {
      if (source === "worker-lib") {
        const isSSR = Boolean(
          (options && options.ssr) ||
          (this as any)?.environment?.name === "ssr",
        );
        return isSSR ? workerLibNodeEsm : workerLibBrowserEsm;
      }
    },
  };
}

export default defineConfig(({ isSsrBuild }) => {
  return {
    esbuild: {
      jsx: "automatic",
      jsxImportSource: "remix/ui",
    },
    ssr: {
      noExternal: true,
    },
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
      workerLibPlugin(),
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
