export function Footer() {
  return (
    <footer
      id="site-footer"
      data-testid="site-footer"
      className="mt-24 border-t border-border/60 py-10 text-center text-sm text-muted-foreground"
    >
      <p>© {new Date().getFullYear()} Nick Wake — Recreational nature photography. Professional test automation.</p>
    </footer>
  );
}
