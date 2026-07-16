import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/lib/gallery-data";

const AUTO_MS = 5000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = heroSlides.length;

  const go = useCallback((i: number) => setIndex(((i % total) + total) % total), [total]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % total), AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, total]);

  return (
    <section
      id="homepage-carousel"
      data-testid="homepage-carousel"
      aria-roledescription="carousel"
      aria-label="Featured photography"
      className="relative h-[80vh] min-h-[480px] w-full overflow-hidden bg-secondary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {heroSlides.map((slide, i) => (
        <article
          key={slide.id}
          id={`carousel-slide-${slide.id}`}
          data-testid="carousel-slide"
          data-slide-index={i}
          data-active={i === index}
          aria-hidden={i !== index}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${total}: ${slide.title}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title}
            loading={i === 0 ? "eager" : "lazy"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-16 text-white">
            <h1
              data-testid="carousel-slide-title"
              className="font-display text-4xl sm:text-6xl md:text-7xl"
            >
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p
                data-testid="carousel-slide-subtitle"
                className="mt-3 max-w-xl text-base text-white/80 sm:text-lg"
              >
                {slide.subtitle}
              </p>
            )}
          </div>
        </article>
      ))}

      <button
        id="carousel-prev-button"
        data-testid="carousel-prev-button"
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        id="carousel-next-button"
        data-testid="carousel-next-button"
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        id="carousel-pagination"
        data-testid="carousel-pagination"
        role="tablist"
        aria-label="Slide pagination"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2"
      >
        {heroSlides.map((s, i) => (
          <button
            key={s.id}
            id={`carousel-dot-${i}`}
            data-testid="carousel-dot"
            data-index={i}
            data-active={i === index}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
