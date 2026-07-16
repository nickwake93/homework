import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";
import { galleryCategories, galleryImages, type GalleryImage } from "@/lib/gallery-data";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Nature Frames" },
      { name: "description", content: "Browse landscape, wildlife, forest, and mountain photography." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [active, setActive] = useState<(typeof galleryCategories)[number]>("All");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const visible = useMemo(
    () => (active === "All" ? galleryImages : galleryImages.filter((g) => g.category === active)),
    [active]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Portfolio</p>
        <h1 data-testid="gallery-heading" className="mt-2 text-4xl sm:text-5xl">Gallery</h1>
      </header>

      <div
        id="gallery-filters"
        data-testid="gallery-filters"
        role="tablist"
        aria-label="Filter by category"
        className="mb-10 flex flex-wrap gap-2"
      >
        {galleryCategories.map((c) => {
          const selected = active === c;
          return (
            <button
              key={c}
              id={`gallery-filter-${c.toLowerCase()}`}
              data-testid={`gallery-filter-${c.toLowerCase()}`}
              data-active={selected}
              role="tab"
              aria-selected={selected}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div
        id="gallery-container"
        data-testid="gallery-container"
        className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4"
      >
        {visible.map((img) => (
          <button
            key={img.id}
            id={`gallery-card-${img.id}`}
            data-testid="gallery-card"
            data-image-id={img.id}
            data-category={img.category}
            type="button"
            onClick={() => setLightbox(img)}
            aria-label={`Open ${img.title}`}
            className="group block w-full overflow-hidden rounded-lg bg-secondary text-left shadow-soft transition hover:shadow-lg break-inside-avoid"
          >
            <div className="relative overflow-hidden">
              <img
                src={img.imageUrl}
                alt={img.title}
                loading="lazy"
                className="h-auto w-full transform transition duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white opacity-0 transition group-hover:opacity-100">
                <p className="font-display text-lg">{img.title}</p>
                <p className="text-xs uppercase tracking-widest text-white/70">{img.category}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p data-testid="gallery-empty" className="py-16 text-center text-muted-foreground">
          No images in this category yet.
        </p>
      )}

      {lightbox && (
        <div
          id="gallery-lightbox"
          data-testid="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            id="lightbox-close-button"
            data-testid="lightbox-close-button"
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <figure
            className="max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              data-testid="lightbox-image"
              src={lightbox.imageUrl}
              alt={lightbox.title}
              className="max-h-[80vh] w-auto rounded-lg"
            />
            <figcaption className="mt-4 text-center text-white/80">
              <span data-testid="lightbox-title" className="font-display text-xl">{lightbox.title}</span>
              <span className="ml-3 text-xs uppercase tracking-widest text-white/60">{lightbox.category}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
