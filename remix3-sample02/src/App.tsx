import { type Remix } from "@remix-run/dom";
import { dom } from "@remix-run/events";
import { Test } from "./Test";

export function App(this: Remix.Handle) {
  let count = 0;
  return () => (
    <>
      <button
        on={[
          dom.click(() => {
            count++;
            this.render();
          }),
        ]}
      >
        Count: {count}
      </button>
      <Test value="test" />
    </>
  );
}
