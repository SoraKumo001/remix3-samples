import { createRoot } from "remix/ui";
import { App } from "./components/App";
import { SSRProvider } from "./SSRProvider";
import { RouterProvider } from "./RouterProvider";
if (document.body) {
  createRoot(document.body).render(
    <RouterProvider url={location.toString()}>
      <SSRProvider>
        <App />
      </SSRProvider>
    </RouterProvider>
  );
} else {
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      createRoot(document.body).render(
        <RouterProvider url={location.toString()}>
          <SSRProvider>
            <App />
          </SSRProvider>
        </RouterProvider>
      );
    },
    { once: true }
  );
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {});
}
