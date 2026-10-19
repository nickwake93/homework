import type { TestInfo } from "@playwright/test";

/**
 * An email address unique to this test run, so parallel tests (and retries) never
 * collide in the app's shared in-memory email store.
 */
export function uniqueEmail(testInfo: TestInfo): string {
  const id = `${testInfo.testId}-${testInfo.repeatEachIndex}-${testInfo.retry}-${Date.now()}`;
  return `qa+${id}@example.com`;
}
