import type { Plugin, ResolvedConfig } from "vite";
import * as fs from "fs";
import * as path from "path";

const VIRTUAL_MODULE_ID = "virtual:routes";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

export function remixRoutes(): Plugin {
  let config: ResolvedConfig;
  let routesDir: string;

  return {
    name: "vite-plugin-remix-routes",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      routesDir = path.join(config.root, "src/routes");
    },
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
      return null;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        if (!routesDir) {
          throw new Error("routesDir has not been initialized.");
        }

        const routeFiles = fs.readdirSync(routesDir);
        let imports = "";
        let routeDefinitions = "";
        const routeMap: { [key: string]: string } = {};

        routeFiles.forEach((file, index) => {
          const fileName = path.parse(file).name;
          const importPath = `@/routes/${fileName}`;

          imports += `import route${index} from "${importPath}";\n`;

          let routePath = `/${fileName
            .replace(/\.index$/, "")
            .replace(/\.\$([^.]+)$/, "/:$1")}`;
          if (routePath === "/index") {
            routePath = "/";
          }
          routeMap[routePath] = `route${index}`;
        });

        routeDefinitions = Object.entries(routeMap)
          .map(
            ([routePath, componentName]) => `  "${routePath}": ${componentName}`
          )
          .join(",\n");

        return `
${imports}
export const route = {
${routeDefinitions}
};`;
      }
      return null;
    },
  };
}
