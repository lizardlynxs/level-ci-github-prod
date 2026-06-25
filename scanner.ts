import { levelCiManual, levelSetup } from "@level-ci/a11y-manual";

const BASE_URL = "http://127.0.0.1:1342";

async function scan() {
  levelSetup({ reportPath: "./level-ci-reports" });
  
  await levelCiManual({
  pages: [
    `${BASE_URL}/article.html`,
    {
      url: `${BASE_URL}/`,
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

scan().catch((err) => {
  console.error(err);
  process.exit(1);
});
