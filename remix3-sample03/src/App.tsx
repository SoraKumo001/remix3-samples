import { type Handle, on } from "remix/ui";

function Test(handle: Handle<{ value: string }>) {
  let mouseState = "mouseOut";
  return () => (
    <div
      mix={[
        on("mouseover", () => {
          mouseState = "mouseOver";
          handle.update();
        }),
        on("mouseout", () => {
          mouseState = "mouseOut";
          handle.update();
        }),
      ]}
    >
      {handle.props.value}:{mouseState}
    </div>
  );
}

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
