import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/home";
import { GalleryPage } from "../pages/gallery";
import { ContactPage } from "../pages/contact";
import { NewPage } from "../pages/newPage";

type Pages = {
  home: HomePage;
  gallery: GalleryPage;
  contact: ContactPage;
  newPage: NewPage;
};

export const test = base.extend<Pages>({
  home: async ({ page }, use) => {
    const home = new HomePage(page);
    await home.goto();
    await use(home);
  },
  gallery: async ({ page }, use) => {
    const gallery = new GalleryPage(page);
    await gallery.goto();
    await use(gallery);
  },
  contact: async ({ page }, use) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await use(contact);
  },
  newPage: async ({ page }, use) => {
    await use(new NewPage(page));
  },
});

export { expect };
