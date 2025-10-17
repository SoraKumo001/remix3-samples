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
