// Turns Playwright's JSON report into a Markdown summary for the CI job summary and PR comment.
// Usage: node scripts/report-summary.mjs <results.json> [report-url]
import { readFileSync } from "node:fs";

const [resultsPath, reportUrl] = process.argv.slice(2);
const report = JSON.parse(readFileSync(resultsPath, "utf8"));
const { stats } = report;

const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, "");
const formatDuration = (ms) => {
  const s = Math.round(ms / 1000);
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
};

// Flatten suites into one entry per test per project.
const tests = [];
const walk = (suite, titles) => {
  const path = suite.title ? [...titles, suite.title] : titles;
  for (const child of suite.suites ?? []) walk(child, path);
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      tests.push({
        title: [...path, spec.title].join(" › "),
        project: test.projectName,
        status: test.status, // expected | unexpected | flaky | skipped
        error: test.results.find((r) => r.error)?.error?.message,
      });
    }
  }
};
for (const suite of report.suites) walk(suite, []);

const failed = tests.filter((t) => t.status === "unexpected");
const flaky = tests.filter((t) => t.status === "flaky");

const headline = failed.length
  ? `❌ ${failed.length} failed`
  : `✅ ${stats.expected} passed${flaky.length ? `, ⚠️ ${flaky.length} flaky` : ""}`;

const lines = [`## Playwright: ${headline}`, ""];
if (reportUrl) {
  lines.push(`**[Open the HTML report →](${reportUrl})** (failed tests include traces)`, "");
}
lines.push(
  "| Passed | Failed | Flaky | Skipped | Duration |",
  "| --: | --: | --: | --: | --: |",
  `| ${stats.expected} | ${stats.unexpected} | ${stats.flaky} | ${stats.skipped} | ${formatDuration(stats.duration)} |`,
  "",
);

const projects = [...new Set(tests.map((t) => t.project))];
const count = (project, status) =>
  tests.filter((t) => t.project === project && t.status === status).length;
lines.push(
  "<details><summary>By project</summary>",
  "",
  "| Project | Passed | Failed | Flaky | Skipped |",
  "| --- | --: | --: | --: | --: |",
  ...projects.map(
    (p) =>
      `| ${p} | ${count(p, "expected")} | ${count(p, "unexpected")} | ${count(p, "flaky")} | ${count(p, "skipped")} |`,
  ),
  "",
  "</details>",
  "",
);

const describe = (t) => {
  const firstLine = t.error ? stripAnsi(t.error).trim().split("\n")[0] : "";
  return `- **[${t.project}]** ${t.title}${firstLine ? `\n  \`${firstLine.slice(0, 200)}\`` : ""}`;
};
if (failed.length) lines.push("### ❌ Failed", "", ...failed.map(describe), "");
if (flaky.length) lines.push("### ⚠️ Flaky (passed on retry)", "", ...flaky.map(describe), "");

console.log(lines.join("\n"));
