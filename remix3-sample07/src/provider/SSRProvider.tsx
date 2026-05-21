import type { Handle, RemixNode } from "@remix-run/component";
import { Frame } from "@remix-run/dom";

const isServer = typeof window === "undefined";
const SSR_DATA_NAME = "__REMIX3_SSR__";

type SSRResult<T = unknown> = {
  state: "idle" | "loading" | "finished";
  value?: T;
};

type SSRState<T = unknown> = SSRResult<T> & {
  children: RemixNode;
  promise: Promise<T>;
};

export type SSRProps = {
  states: Record<string, SSRState>;
};

export function SSRProvider(this: Handle<SSRProps>) {
  return ({
    storage,
    children,
  }: {
    storage?: SSRProps;
    children: RemixNode;
  }) => {
    if (isServer) {
      this.context.set(
        storage ?? {
          states: {},
        }
      );
    } else {
      const node = document.getElementById(SSR_DATA_NAME);
      const states = JSON.parse(node?.innerText ?? "{}");
      this.context.set(
        storage ?? {
          states: Object.fromEntries(
            Object.entries(states).map(([key, v]) => [
              key,
              {
                state: "finished",
                promise: Promise.resolve(v),
                value: v,
                children: undefined,
              },
            ])
          ),
        }
      );
    }
    return (
      <>
        {children}
        {/* {isServer && <Frame src="ssr-data:" />} */}
      </>
    );
  };
}

export function SSRData(this: Handle<SSRResult>) {
  return ({
    value,
    state,
    children,
  }: {
    value: unknown;
    state: "idle" | "loading" | "finished";
    children: RemixNode;
  }) => {
    this.context.set({ value, state });
    return children;
  };
}

export function SSRFetch<T>(
  this: Handle,
  {
    name,
    action,
    children,
  }: {
    name: string;
    action: () => Promise<T>;
    children: RemixNode;
  }
) {
  const context = this.context.get(SSRProvider);
  if (!context) return undefined;
  const frameName = `ssr:${name}`;
  if (!context.states[frameName]) {
    const promise = action();
    const state: SSRState<T> = {
      promise,
      state: "loading",
      value: undefined,
      children,
    };
    context.states[frameName] = state;
    promise.then((v) => {
      context.states[frameName].state = "finished";
      context.states[frameName].value = v;
      if (!isServer) this.update();
    });
  }
  if (isServer) {
    return <Frame src={frameName} />;
  } else {
    const state = context.states[frameName];
    return (
      <SSRData value={state.value} state={state.state}>
        {children}
      </SSRData>
    );
  }
}

export const useSSR = <T,>(inst: Handle) => {
  return inst.context.get(SSRData) as SSRResult<T>;
};

export const resolveFrame = async (
  src: string,
  states: Record<string, SSRState>
) => {
  if (src === "ssr-data:") {
    let length = 0;
    while (length !== Object.values(states).length) {
      await Promise.all(Object.values(states).map((v) => v.promise));
      length = Object.values(states).length;
    }
    const values: Record<string, unknown> = {};
    for (const [key, p] of Object.entries(states)) {
      values[key] = await p.promise;
    }
    return (
      <script type="application/json" id={SSR_DATA_NAME}>
        {JSON.stringify(values)}
      </script>
    );
  }
  const state = states[src];
  const children = state.children;
  const value = await state.promise;
  state.value = value;
  return (
    <SSRData value={value} state={state.state}>
      {children}
    </SSRData>
  );
};
