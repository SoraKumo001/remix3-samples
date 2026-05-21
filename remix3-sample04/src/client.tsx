import { createRoot, type VirtualRoot } from "remix/ui";
import { App } from "./components/App.js";

let root: VirtualRoot | null = null;

function mount() {
  if (document.body) {
    root = createRoot(document.body);
    root.render(<App />);
  }
}

if (document.body) {
  mount();
} else {
  window.addEventListener("DOMContentLoaded", mount, { once: true });
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {});
  import.meta.hot.dispose(() => {
    if (root) {
      root.dispose();
    } else {
      window.removeEventListener("DOMContentLoaded", mount);
    }
  });
}
