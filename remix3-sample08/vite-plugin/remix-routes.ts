import * as fs from "fs";
import * as path from "path";
import { type Plugin } from "vite";

const VIRTUAL_MODULE_ID = "virtual:routes";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

export function remixRoutes(options?: { dir?: string }): Plugin {
  const dir = options?.dir ?? "./src/routes";
  let routesDir: string;

  return {
    name: "vite-plugin-remix-routes",
    config(config) {
      return {
        resolve: {
          alias: {
            "@": path.resolve(config.root || process.cwd(), dir),
          },
        },
      };
    },
    configResolved(resolvedConfig) {
      routesDir = path.join(resolvedConfig.root, dir);
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
        const imports: string[] = [];
        const routeMap: { [key: string]: string } = {};

        routeFiles.forEach((file, index) => {
          const fileName = path.parse(file).name;
          const importPath = `@/${fileName}`;

          imports.push(`import * as route${index} from "${importPath}";`);

          let routePath = fileName
            .replace(/\.(tsx|ts)$/, "")
            .split(".")
            .map((segment) => {
              if (segment.startsWith("$")) {
                return `:${segment.substring(1)}`;
              }
              return segment;
            })
            .join("/");

          if (routePath === "index") {
            routePath = "";
          }
          routePath = `/${routePath}`;
          routeMap[routePath] = `route${index}`;
        });

        const routeDefinitions: string[] = [];
        const loaderDefinitions: string[] = [];

        Object.entries(routeMap).forEach(([routePath, moduleName]) => {
          routeDefinitions.push(`  "${routePath}": ${moduleName}.default`);
          loaderDefinitions.push(`  "${routePath}": ${moduleName}.loader`);
        });

        return `
${imports.join("\n")}
export const route = {
${routeDefinitions.join(",\n")}
};
export const loaders = {
${loaderDefinitions.join(",\n")}
};`;
      }
      return null;
    },
  };
}
