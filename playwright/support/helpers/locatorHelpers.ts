import { expect, FrameLocator, Locator, Page } from "@playwright/test";

export async function headingVisibility(
  page: Page | FrameLocator | Locator,
  validationString: string,
  timeout: number = 5000,
  level: number = 1,
  exact: boolean = true,
) {
  try {
    await expect(
      page.getByRole("heading", {
        name: `${validationString}`,
        level: level,
        exact: exact,
      }),
    ).toBeVisible({ timeout });
  } catch (error) {
    throw new Error(
      `Unable to validate header ${validationString}: ${error instanceof Error ? error.message : error}`,
    );
  }
}
