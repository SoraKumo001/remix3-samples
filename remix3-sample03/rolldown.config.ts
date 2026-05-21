import { defineConfig } from "rolldown";
import { builtinModules } from "module";

export default [
  defineConfig({
    input: { bundle: "./src/client.tsx" },
    output: {
      dir: "public",
      entryFileNames: "[name].js",
    },
  }),
  defineConfig({
    input: ["./src/server.tsx"],
    output: {
      dir: "dist",
      entryFileNames: "index.js",
    },
    external: (id) => id.startsWith("node:") || builtinModules.includes(id),
  }),
];
