import { Frame, type Remix } from "@remix-run/dom";

const isServer = typeof window === "undefined";

type SSRState<T = unknown> = {
  state: "idle" | "loading" | "finished";
  value: T;
  children: Remix.RemixNode;
  promise: Promise<T>;
};

export type SSRProps = {
  states: Record<string, SSRState>;
};

export function SSRProvider(this: Remix.Handle<SSRProps>) {
  return ({
    storage,
    children,
  }: {
    storage?: SSRProps;
    children: Remix.RemixNode;
  }) => {
    if (isServer) {
      this.context.set(
        storage ?? {
          states: {},
        }
      );
    } else {
      const node = document.getElementById("__REMIX3_SSR__");
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
        {isServer && <Frame src="ssr-data" />}
      </>
    );
  };
}

export function SSRData(this: Remix.Handle<unknown>) {
  return ({
    value,
    children,
  }: {
    value: unknown;
    children: Remix.RemixNode;
  }) => {
    this.context.set(value);
    return children;
  };
}

export function SSRFetch(this: Remix.Handle) {
  const context = this.context.get(SSRProvider);
  return ({
    name,
    action,
    children,
  }: {
    name: string;
    action: () => Promise<void>;
    children: Remix.RemixNode;
  }) => {
    if (isServer) {
      if (!context.states[name]) {
        const state: SSRState = {
          promise: action(),
          state: "loading",
          value: undefined,
          children,
        };
        context.states[name] = state;
      }
      return <Frame src={name} />;
    } else {
      if (!context.states[name]) {
        const promise = action();
        const state: SSRState = {
          promise,
          state: "loading",
          value: undefined,
          children,
        };
        context.states[name] = state;
        promise.then((v) => {
          context.states[name].state = "finished";
          context.states[name].value = v;
          this.render();
        });
      }
      const state = context.states[name];
      return <SSRData value={state.value}>{children}</SSRData>;
    }
  };
}

export const useSSR = <T,>(inst: Remix.Handle) => {
  return inst.context.get(SSRData) as T;
};

export const resolveFrame = async (
  src: string,
  states: Record<string, SSRState>
) => {
  if (src === "ssr-data") {
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
      <script type="application/json" id="__REMIX3_SSR__">
        {JSON.stringify(values)}
      </script>
    );
  }
  const state = states[src];
  const children = state.children;
  const value = await state.promise;
  state.value = value;
  return <SSRData value={value}>{children}</SSRData>;
};
