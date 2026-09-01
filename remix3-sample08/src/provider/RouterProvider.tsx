import { type Handle, on, type RemixNode } from "remix/ui";
import { createMatcher, type Match } from "@remix-run/route-pattern/match";
import { route, loaders } from "virtual:routes";

const isServer = typeof window === "undefined";

interface RouterContext {
  serverUrl: string;
  navigate: (url: string) => void;
  params?: Match<string, undefined>;
  loaderData: Record<string, any>;
}

export const matchRoute = (url: string) => {
  for (const [pattern, content] of Object.entries(route)) {
    const matcher = createMatcher(pattern);
    const match = matcher.match(url);
    if (match) {
      return {
        routePath: pattern,
        routeMatch: match,
        content,
      };
    }
  }
  return null;
};

export function RouterProvider(
  handle: Handle<
    { url?: string; value?: RouterContext; children: RemixNode },
    RouterContext
  >,
) {
  const initialLoaderData = !isServer
    ? JSON.parse(
        document.getElementById("__REMIX3_LOADER_DATA__")?.textContent || "{}",
      )
    : {};

  const context: RouterContext = {
    serverUrl: "",
    navigate: async (url: string) => {
      const fullUrl = new URL(url, location.href).href;
      history.pushState({}, "", url);

      const match = matchRoute(fullUrl);
      if (match) {
        context.params = match.routeMatch;
        const loader = (loaders as Record<string, any>)[match.routePath];
        if (loader) {
          try {
            const data = await loader({ params: match.routeMatch.params });
            context.loaderData[match.routePath] = data;
          } catch (e) {
            console.error("Loader error", e);
          }
        }
      }
      handle.update();
    },
    loaderData: initialLoaderData,
  };
  handle.context.set(context);

  const handlePopState = async () => {
    const fullUrl = location.href;
    const match = matchRoute(fullUrl);
    if (match) {
      context.params = match.routeMatch;
      const loader = (loaders as Record<string, any>)[match.routePath];
      if (loader) {
        try {
          const data = await loader({ params: match.routeMatch.params });
          context.loaderData[match.routePath] = data;
        } catch (e) {
          console.error("Loader error in popstate", e);
        }
      }
    }
    handle.update();
  };
  if (!isServer) {
    addEventListener("popstate", handlePopState);
    handle.signal.addEventListener("abort", () => {
      removeEventListener("popstate", handlePopState);
    });
  }
  return () => {
    const { url, value, children } = handle.props;
    if (value) {
      handle.context.set(value);
      return <>{children}</>;
    }
    if (isServer && url) {
      context.serverUrl = url;
    }
    return <>{children}</>;
  };
}

export const useLocation = (inst: Handle<any, any>) => {
  if (isServer) {
    const url = new URL(inst.context.get(RouterProvider).serverUrl);
    return url.pathname;
  }
  return location.pathname;
};

export const useFullLocation = (inst: Handle<any, any>) => {
  if (isServer) {
    const url = new URL(inst.context.get(RouterProvider).serverUrl);
    return url.href;
  }
  return location.href;
};

export const useNavigate = (inst: Handle<any, any>) => {
  return inst.context.get(RouterProvider).navigate;
};

export const useParams = <T extends Record<string, unknown>>(
  inst: Handle<any, any>,
) => {
  const p = inst.context.get(RouterProvider).params;
  if (!p) throw "error params";
  return p.params as T;
};

export function Link(
  handle: Handle<{ to: string; children: RemixNode; className?: string }>,
) {
  return () => {
    const { to, children, className } = handle.props;
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  };
}

export type RouteType = Record<string, any>;

export const useRouter = (inst: Handle<any, any>, route: RouteType) => {
  const location = useFullLocation(inst);

  for (const [pattern, content] of Object.entries(route)) {
    const matcher = createMatcher(pattern);
    const match = matcher.match(location);
    if (match) {
      inst.context.get(RouterProvider).params = match;
      return content;
    }
  }
  return () => () => <></>;
};

export function Outlet(handle: Handle) {
  return () => {
    const routerContext = handle.context.get(RouterProvider);
    const location = useFullLocation(handle);

    let activeRoutePath = "";
    let Route: any = null;

    for (const [pattern, content] of Object.entries(route)) {
      const matcher = createMatcher(pattern);
      const match = matcher.match(location);
      if (match) {
        routerContext.params = match;
        activeRoutePath = pattern;
        Route = content;
        break;
      }
    }

    if (!Route) {
      return <></>;
    }

    const loaderData = routerContext.loaderData?.[activeRoutePath];
    return <Route loaderData={loaderData} />;
  };
}
