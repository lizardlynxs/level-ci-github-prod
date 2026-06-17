import { test, expect } from "@playwright/test";
import { levelAnalyze } from "@level-ci/a11y-playwright";

test.describe("navigation", () => {
  test("runs Level CI analysis on the home page", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".headline")).toContainText(/Best Broadband/);
    await expect(page.locator(".headline")).toContainText(
      /Internet Plans For You/
    );
    // Run the accessibility analysis and write a report to ./level-ci-reports
    await levelAnalyze(page);
  });
});
