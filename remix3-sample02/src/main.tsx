import { App } from "./App";
import { createRoot } from "@remix-run/dom";

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept(() => {});
}
