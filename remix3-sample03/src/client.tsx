import { run } from "remix/ui";

const app = run({
  async loadModule(moduleUrl, exportName) {
    const mod = await import(moduleUrl);
    return mod[exportName];
  },
});

await app.ready();
