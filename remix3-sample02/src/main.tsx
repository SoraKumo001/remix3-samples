import { App } from "./App";
import { createRoot } from "remix/ui";

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept(() => {});
}
