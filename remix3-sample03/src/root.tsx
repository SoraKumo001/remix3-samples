import type { Remix } from "@remix-run/dom";
import { App } from "./App";

export function Layout(this: Remix.Handle) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="module" defer src="./bundle.js" />
        <title>Remix3 Test</title>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
