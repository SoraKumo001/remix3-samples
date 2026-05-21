import { type Handle, on, type RemixNode } from "remix/ui";


const isServer = typeof window === "undefined";

interface RouterContext {
  url: string;
  navigate: (url: string) => void;
}

export function RouterProvider(
  handle: Handle<{ url: string; children: RemixNode }, RouterContext>
) {
  const context: RouterContext = {
    url: "",
    navigate: (url: string) => {
      history.pushState({}, "", url);
      handle.update();
    },
  };
  handle.context.set(context);

  const handlePopState = () => {
    handle.update();
  };
  if (!isServer) {
    addEventListener("popstate", handlePopState);
    handle.signal.addEventListener("abort", () => {
      removeEventListener("popstate", handlePopState);
    });
  }
  return ({ url, children }: { url: string; children: RemixNode }) => {
    context.url = url;
    return <>{children}</>;
  };
}

export const useLocation = (inst: Handle<any, any>) => {
  if (isServer) {
    const url = new URL(inst.context.get(RouterProvider).url);
    return url.pathname;
  }
  return location.pathname;
};

export const useNavigate = (inst: Handle<any, any>) => {
  return inst.context.get(RouterProvider).navigate;
};

export function Link(handle: Handle) {
  const navigate = useNavigate(handle);
  return ({ to, children }: { to: string; children: RemixNode }) => {
    return (
      <a
        href={to}
        mix={[
          on("click", (e) => {
            e.preventDefault();
            navigate(to);
          }),
        ]}
      >
        {children}
      </a>
    );
  };
}
