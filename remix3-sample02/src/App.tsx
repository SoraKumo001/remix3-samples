import { type Handle, on } from "remix/ui";
import { Test } from "./Test";

export function App(handle: Handle) {
  let count = 0;
  return () => (
    <>
      <button
        mix={[
          on("click", () => {
            count++;
            handle.update();
          }),
        ]}
      >
        Count: {count}
      </button>
      <Test value="test" />
    </>
  );
}
