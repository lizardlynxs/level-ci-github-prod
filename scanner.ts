import { levelCiManual, levelSetup } from "@level-ci/a11y-manual";

const BASE_URL = "http://127.0.0.1:1342";

async function scan() {
  levelSetup({ reportPath: "./level-ci-reports" });
  
  await levelCiManual({
  pages: [
    `${BASE_URL}/article.html`,
    {
      urls: [`${BASE_URL}/`],
      setup: async ({ page, levelAnalyze }) => {
        // go to therms.html
        await page.locator('#dropdown01').hover();
        await page.locator('.dropdown-menu li a:has-text("Terms Conditions")').click();
        console.log(page.url());
        
        // analyze therms.html
        await levelAnalyze();
      },
    },
  ],
});
}

// Multiple scans in one flow:
// analyze the home page in two states — initial load and after advancing the testimonial slider
async function scanMultiStep() {
  levelSetup({ reportPath: "./level-ci-reports" });

  await levelCiManual({
    pages: [
      {
        urls: [`${BASE_URL}/`],
        setup: async ({ page, levelAnalyze }) => {
          await levelAnalyze({ reportPath: "./level-ci-reports/home-initial" });
          await page.locator(".swiper-button-next").click();
          await levelAnalyze({ reportPath: "./level-ci-reports/home-slide-2" });
        },
      },
    ],
  });
}

// Form interaction before analyzing:
// fill the contact form, then analyze the filled state
async function scanForm() {
  levelSetup({ reportPath: "./level-ci-reports" });

  await levelCiManual({
    pages: [
      {
        urls: [`${BASE_URL}/`],
        setup: async ({ page, levelAnalyze }) => {
          await page.locator("#exampleFormControlInput1").fill("Test User");
          await page.locator("#exampleFormControlInput3").fill("test@example.com");
          await page.locator("#exampleFormControlTextarea1").fill("Hello");
          await levelAnalyze({ reportPath: "./level-ci-reports/contact-filled" });
        },
      },
    ],
  });
}

// Per-page config override + URL list:
// auto-analyze privacy and terms with the default report path;
// route article to its own subdirectory via a per-page config override
async function scanConfig() {
  await levelCiManual({
    defaults: { reportPath: "./level-ci-reports" },
    pages: [
      `${BASE_URL}/privacy.html`,
      `${BASE_URL}/terms.html`,
      {
        urls: [`${BASE_URL}/article.html`],
        config: { reportPath: "./level-ci-reports/article" },
      },
    ],
  });
}

// Dry run, error handling, and alternate browser engine
async function scanEdge() {
  // dry run — switchOff skips analysis; no report files are written
  await levelCiManual({
    defaults: { reportPath: "./level-ci-reports", switchOff: true },
    pages: [`${BASE_URL}/`],
  });

  // error handling — an unreachable URL surfaces as results[0].error without stopping the run
  const results = await levelCiManual({ pages: ["http://localhost:1"] });
  if (results[0].error) {
    console.error("Scan failed:", results[0].error.message);
  }

  // alternate engine — requires `npx playwright install firefox`
  await levelCiManual({
    browser: { type: "firefox", launchOptions: { headless: true } },
    defaults: { reportPath: "./level-ci-reports/firefox" },
    pages: [{ urls: [`${BASE_URL}/terms.html`] }],
  });
}

scan().catch((err) => {
  console.error(err);
  process.exit(1);
});
// scanMultiStep().catch((err) => { console.error(err); process.exit(1); });
// scanForm().catch((err) => { console.error(err); process.exit(1); });
// scanConfig().catch((err) => { console.error(err); process.exit(1); });
// scanEdge().catch((err) => { console.error(err); process.exit(1); });
