import { createRoot } from "@remix-run/dom";
import { App } from "./App";
if (document.body) {
  createRoot(document.body).render(<App />);
} else {
  window.addEventListener(
    "load",
    () => {
      console.log(document.body.innerHTML);
      createRoot(document.body).render(<App />);
    },
    { once: true }
  );
}
