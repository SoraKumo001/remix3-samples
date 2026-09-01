import { type Handle } from "remix/ui";
import css from "./index.css?inline";
import { App } from "./App";
import { SSRProvider, type SSRProps } from "./provider/SSRProvider";

export function Layout(handle: Handle<{ storage?: SSRProps }>) {
  return () => {
    return (
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
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
          <SSRProvider storage={handle.props.storage}>
            <App />
          </SSRProvider>
        </body>
      </html>
    );
  };
}
