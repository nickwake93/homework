import { Outlet, createRootRoute, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nature Frames — Recreational Nature Photography" },
      {
        name: "description",
        content:
          "Modern nature photography portfolio: landscapes, wildlife, forests, and mountains. Commissions and prints available.",
      },
      { name: "author", content: "Nature Frames" },
      { property: "og:title", content: "Nature Frames" },
      {
        property: "og:description",
        content: "Recreational nature photography — landscapes, wildlife, forests, and mountains.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());

  // Signal that React has hydrated and event handlers are attached. Effects run
  // after the whole tree commits, so this is a reliable "ready" marker for
  // automation (SSR HTML is visible well before it is interactive).
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" data-testid="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-6xl">404</h1>
        <p className="mt-3 text-muted-foreground">This page is off the trail.</p>
        <a
          href="/"
          className="mt-6 inline-block rounded-md bg-foreground px-4 py-2 text-sm text-background"
        >
          Return home
        </a>
      </div>
    </div>
  );
}

function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-md bg-foreground px-4 py-2 text-sm text-background"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
