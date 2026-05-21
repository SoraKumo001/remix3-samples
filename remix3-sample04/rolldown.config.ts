import { defineConfig } from "rolldown";

export default [
  defineConfig({
    input: { bundle: "./src/client.tsx" },
    output: {
      dir: "public",
      entryFileNames: "[name].js",
    },
  }),
];
