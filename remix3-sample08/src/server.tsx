import { renderToStream } from "remix/ui/server";
import { Layout } from "./root";
import { RouterProvider, matchRoute } from "./provider/RouterProvider";
import { loaders } from "virtual:routes";

const handler = async (url: string) => {
  const loaderData: Record<string, any> = {};

  const fullUrl = new URL(url, "http://localhost").href;
  const match = matchRoute(fullUrl);
  if (match) {
    const loader = (loaders as Record<string, any>)[match.routePath];
    if (loader) {
      try {
        const data = await loader({ params: match.routeMatch.params });
        loaderData[match.routePath] = data;
      } catch (e) {
        console.error("Loader error in server", e);
      }
    }
  }

  const routerContext = {
    serverUrl: url,
    navigate: () => {},
    loaderData,
  };

  return new Response(
    renderToStream(
      <RouterProvider value={routerContext}>
        <Layout loaderData={loaderData} />
      </RouterProvider>
    ),
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
};

export default handler;
