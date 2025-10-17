import type { Remix } from "@remix-run/dom";
import { App } from "./components/App";
import { SSRProvider, type SSRProps } from "./SSRProvider";

export function Layout(this: Remix.Handle) {
  return ({ storage }: { storage: SSRProps }) => (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="module"
          src={
            /\.(tsx|ts)$/.test(import.meta.url)
              ? "/src/client.tsx"
              : "/bundle.js"
          }
        />
        <title>Remix3 Test</title>
      </head>
      <body>
        <SSRProvider storage={storage}>
          <App />
        </SSRProvider>
      </body>
    </html>
  );
}
