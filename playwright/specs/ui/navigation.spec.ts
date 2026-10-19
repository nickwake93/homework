import { test, expect } from "../../support/fixtures";

test.describe("Primary navigation", () => {
  const routes = [
    { name: "Gallery", url: /\/gallery$/ },
    { name: "Contact", url: /\/contact$/ },
    { name: "Home", url: /\/$/ },
  ] as const;

  test(
    "links navigate between pages and mark the current one",
    { tag: "@smoke" },
    async ({ home, page }) => {
      for (const { name, url } of routes) {
        await home.nav.link(name).click();
        await expect(page).toHaveURL(url);
        await expect(home.nav.link(name)).toHaveAttribute("aria-current", "page");
        for (const other of routes.filter((r) => r.name !== name)) {
          await expect(home.nav.link(other.name)).not.toHaveAttribute("aria-current");
        }
      }
    },
  );

  test("logo links home", async ({ contact, page }) => {
    await contact.nav.logo.click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("Theme toggle", () => {
  test.describe("with a light system preference", () => {
    test.use({ colorScheme: "light" });

    test("starts light, switches to dark, and remembers it", async ({ home, page }) => {
      // The theme is applied as a class on the root element.
      const root = page.locator("html");
      await expect(root).not.toHaveClass(/\bdark\b/);
      await expect(home.nav.themeToggle).toHaveAccessibleName("Switch to dark mode");

      await home.nav.themeToggle.click();
      await expect(root).toHaveClass(/\bdark\b/);
      await expect(home.nav.themeToggle).toHaveAccessibleName("Switch to light mode");

      await home.goto();
      await expect(root).toHaveClass(/\bdark\b/);
      await expect(home.nav.themeToggle).toHaveAccessibleName("Switch to light mode");
    });
  });

  test.describe("with a dark system preference", () => {
    test.use({ colorScheme: "dark" });

    test("starts dark on first visit", async ({ home, page }) => {
      await expect(page.locator("html")).toHaveClass(/\bdark\b/);
      await expect(home.nav.themeToggle).toHaveAccessibleName("Switch to light mode");
    });
  });
});
