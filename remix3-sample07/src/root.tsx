import type { Handle } from "@remix-run/component";
import css from "./index.css?inline";
// import { App } from "./App";

export function Layout(this: Handle) {
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
        {/* Due to a bug in Remix3, attempting to SSR causes hydration to fail. */}
        {/* <App /> */}
      </body>
    </html>
  );
}
