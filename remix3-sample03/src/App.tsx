import { type Remix } from "@remix-run/dom";
import { press } from "@remix-run/events/press";
import { dom } from "@remix-run/events";

function Test(this: Remix.Handle) {
  let mouseState = "mouseOut";
  return ({ value }: { value: string }) => (
    <div
      on={[
        dom.mouseover(() => {
          mouseState = "mouseOver";
          this.render();
        }),
        dom.mouseout(() => {
          mouseState = "mouseOut";
          this.render();
        }),
      ]}
    >
      {value}:{mouseState}
    </div>
  );
}

export function App(this: Remix.Handle) {
  let count = 0;

  return () => (
    <>
      <button
        on={[
          press(() => {
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
