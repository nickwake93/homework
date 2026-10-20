import { test, expect } from "../../support/fixtures";

// Guards against full-size camera originals creeping back in: they were 2–10MB each, and
// the gallery downloaded ~37MB. Resized photos are ~250–750KB.
const MAX_IMAGE_BYTES = 1024 * 1024;

// Runs in desktop Chromium only, as image sizes don't depend on the browser.
test.describe("Image weight budget", () => {
  for (const path of ["/", "/gallery"]) {
    test(`every image on ${path} is under 1MB`, async ({ page, request }) => {
      await page.goto(path);
      // Read sources from the DOM, as lazy-loaded images aren't fetched until scrolled to.
      // role="img" also matches non-<img> elements (e.g. the star rating), so keep real images.
      const sources = await page
        .getByRole("img", { includeHidden: true })
        .evaluateAll((els) => [
          ...new Set(els.filter((el) => el instanceof HTMLImageElement).map((img) => img.src)),
        ]);
      expect(sources.length).toBeGreaterThan(0);

      const sizes = await Promise.all(
        sources.map(async (src) => {
          const res = await request.get(src);
          expect(res.ok(), src).toBeTruthy();
          return { src, megabytes: +((await res.body()).length / 1048576).toFixed(2) };
        }),
      );
      expect(sizes.filter((s) => s.megabytes * 1048576 > MAX_IMAGE_BYTES)).toEqual([]);
    });
  }
});
