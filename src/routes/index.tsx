import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/HeroCarousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nature Frames — Photography Portfolio" },
      {
        name: "description",
        content:
          "Recreational nature photographer offering commissioned prints and outdoor photography.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <HeroCarousel />

      <section
        id="about-section"
        data-testid="about-section"
        aria-labelledby="about-heading"
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div
            id="about-photo"
            data-testid="about-photo"
            className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary shadow-soft"
          >
            <img
              src="/images/IMG_1091.JPG"
              alt="Portrait of the photographer in the field"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="fade-in">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">About me</p>
            <h2
              id="about-heading"
              data-testid="about-heading"
              className="mt-3 text-4xl sm:text-5xl"
            >
              Hi, I'm Nick Wake.
            </h2>
            <p
              data-testid="about-bio"
              className="mt-6 text-base leading-relaxed text-muted-foreground"
            >
              I'm a very average amateur photographer, using this website as an opportunity to
              demonstrate my much more sophisticated test automation skills. Within this repository
              I'll be flexing my testing muscles with full E2E Playwright, Accessibility, API,
              Performance and Component tests, all in a format that will hopefully demonstrate my
              skillset.
            </p>
            <p
              data-testid="about-bio-secondary"
              className="mt-4 text-base leading-relaxed text-muted-foreground"
            >
              That said, if you're hiring a photographer, I'm more than happy to travel around the
              world taking photos on an iPhone for you!
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/gallery"
                id="cta-view-gallery"
                data-testid="cta-view-gallery"
                className="inline-flex items-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
              >
                View Gallery
              </Link>
              <Link
                to="/contact"
                id="cta-get-in-touch"
                data-testid="cta-get-in-touch"
                className="inline-flex items-center rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
