import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.tsx",
  output: {
    file: "public/bundle.js",
  },
  resolve: {
    alias: {
      "react/jsx-runtime": "@remix-run/dom/jsx-runtime",
      "react/jsx-dev-runtime": "@remix-run/dom/jsx-dev-runtime",
    },
  },
});
