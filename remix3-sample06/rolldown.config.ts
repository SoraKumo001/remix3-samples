import { defineConfig } from "rolldown";

export default [
  defineConfig({
    input: { bundle: "./src/client.tsx" },
    output: {
      dir: "./dist/assets",
      entryFileNames: "[name].js",
    },
    resolve: {
      alias: {
        "react/jsx-runtime": "@remix-run/dom/jsx-runtime",
        "react/jsx-dev-runtime": "@remix-run/dom/jsx-dev-runtime",
      },
    },
  }),
];
