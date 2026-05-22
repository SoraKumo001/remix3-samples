import type { Handle } from "remix/ui";
import { App } from "./App";
import css from "./index.css?inline";

export function Layout(handle: Handle<{ loaderData?: Record<string, any> }>) {
  return () => {
    const { loaderData } = handle.props;
    const serializedLoaderData = JSON.stringify(loaderData || {}).replace(/</g, "\\u003c");

    return (
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style type="text/css">{css}</style>
          <script
            type="module"
            src={
              /\.(tsx|ts)$/.test(import.meta.url)
                ? "/src/client.tsx"
                : "/client.js"
            }
          />
          <title>Remix3 Test</title>
        </head>
        <body>
          <App />
          <script id="__REMIX3_LOADER_DATA__" type="application/json">
            {serializedLoaderData}
          </script>
        </body>
      </html>
    );
  };
}
