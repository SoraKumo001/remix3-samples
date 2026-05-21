import { defineConfig } from "rolldown";

export default [
  defineConfig({
    input: { bundle: "./src/client.tsx" },
    output: {
      dir: "public",
      entryFileNames: "[name].js",
    },
    resolve: {
      alias: {
        "react/jsx-runtime": "remix/ui/jsx-runtime",
        "react/jsx-dev-runtime": "remix/ui/jsx-dev-runtime",
      },
    },
  }),
];
