import AxeBuilder from "@axe-core/playwright";
import type { Page, TestInfo } from "@playwright/test";

// WCAG 2.2 A/AA plus axe's best-practice rules (landmarks, heading order, etc.).
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

/**
 * Run axe against the current page state and return a readable summary of violations
 * (empty when clean). The full axe results are attached to the test report.
 */
export async function scanForViolations(page: Page, testInfo: TestInfo): Promise<string[]> {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

  await testInfo.attach("axe-results", {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });

  return results.violations.map(
    (v) =>
      `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length > 1 ? "s" : ""})\n` +
      v.nodes.map((n) => `    ${n.target.join(" ")}`).join("\n"),
  );
}
