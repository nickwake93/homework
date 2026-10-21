const REPO_URL = "https://github.com/nickwake93/nature-frames-qa";
const REPORT_URL = "https://nickwake93.github.io/nature-frames-qa/main/";

const linkClass =
  "font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent";

export function Footer() {
  return (
    <footer
      id="site-footer"
      data-testid="site-footer"
      className="mt-24 border-t border-border/60 py-10 text-center text-sm text-muted-foreground"
    >
      <div className="mx-auto max-w-2xl space-y-3 px-4">
        <p>
          This site is a <strong className="text-foreground">test engineering portfolio</strong>{" "}
          project: an AI-built app with a Playwright suite I designed, run in CI on every change.
        </p>
        <p className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a className={linkClass} href={REPO_URL}>
            See the tests on GitHub
          </a>
          <a className={linkClass} href={REPORT_URL}>
            Latest test report
          </a>
        </p>
        <p>
          © {new Date().getFullYear()} Nick Wake — Recreational nature photography. Professional
          test automation.
        </p>
      </div>
    </footer>
  );
}
