import { Link, useLocation } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home", id: "nav-home" },
    { to: "/gallery", label: "Gallery", id: "nav-gallery" },
    { to: "/contact", label: "Contact", id: "nav-contact" },
  ] as const;

  return (
    <header
      id="site-header"
      data-testid="site-header"
      className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur"
    >
      <nav
        id="primary-nav"
        data-testid="primary-nav"
        aria-label="Primary"
        className="mx-auto flex max-w-6xl flex-col items-start gap-1 px-4 py-2 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-6 sm:py-0"
      >
        <Link
          to="/"
          id="nav-logo"
          data-testid="nav-logo"
          className="font-display text-xl tracking-tight"
        >
          Nature<span className="text-accent">Frames</span>
        </Link>
        {/* On narrow screens the links wrap under the logo; -ml-3 lines "Home" up with it. */}
        <ul className="-ml-3 flex items-center gap-1 sm:ml-0 sm:gap-2">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                id={l.id}
                data-testid={l.id}
                aria-current={pathname === l.to ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground ${
                  pathname === l.to ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              id="theme-toggle"
              data-testid="theme-toggle"
              type="button"
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
