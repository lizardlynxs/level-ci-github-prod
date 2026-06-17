import { chromium } from "playwright";
import { levelAnalyze, levelSetup } from "@level-ci/a11y-playwright";

const BASE_URL = "http://127.0.0.1:1342";

async function scan() {
  levelSetup({ reportPath: "./level-ci-reports" });
  
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/`);

    // optional: navigation actions here (page.click, page.fill, ...)
    await levelAnalyze(page);

    await page.goto(`${BASE_URL}/article.html`);
    // optional: navigation actions here
    await levelAnalyze(page);

    await page.goto(`${BASE_URL}/privacy.html`);
    // optional: navigation actions here
    await levelAnalyze(page);

    // await page.goto(`${BASE_URL}/terms.html`);
    // // optional: navigation actions here
    // await levelAnalyze(page);
  } finally {
    await browser.close();
  }
}

scan().catch((err) => {
  console.error(err);
  process.exit(1);
});
