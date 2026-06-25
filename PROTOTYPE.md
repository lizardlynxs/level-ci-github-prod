# `@level-ci/a11y-manual` — prototype overview

## What this is

A standalone accessibility scanner for users who **do not** run Level CI inside an e2e
framework (Cypress, Playwright Test, Puppeteer, WebDriver, …).

Instead of wiring analysis into existing tests, you write a small script that hands a list of
pages to a single function. The package launches a managed Playwright browser, visits each
page, (optionally) runs your interaction steps, runs the Level CI accessibility analysis, and
returns structured results — no test runner required.

```ts
import { levelCiManual } from '@level-ci/a11y-manual'

const results = await levelCiManual({
  pages: ['https://example.com'],
  defaults: { reportPath: './a11y-reports' },
})
```

## Install & import

- Peer dependency: `playwright-core >= 1.16.0`.
- Runs **headless Chromium** by default; the engine can be switched to Firefox or WebKit.

```ts
import { levelCiManual, levelSetup } from '@level-ci/a11y-manual'

levelSetup({}) // optional: set global LaunchConfig defaults once per process
```

## API at a glance

```ts
levelCiManual(config: ManualConfig): Promise<ManualPageResult[]>
```

### `ManualConfig`

| Field      | Type                  | Notes                                                       |
| ---------- | --------------------- | ----------------------------------------------------------- |
| `pages`    | `ManualPageInput[]`   | A bare URL string, or a `ManualPage` object. **Required.**  |
| `defaults` | `LaunchConfig`        | Shared analysis config applied to every page.               |
| `browser`  | `BrowserConfig`       | Engine + Playwright launch options. Defaults to headless Chromium. |

### `ManualPage`

| Field    | Type                                          | Notes                                                            |
| -------- | --------------------------------------------- | ---------------------------------------------------------------- |
| `urls`   | `string[]`                                    | One or more URLs to visit for this entry.                        |
| `setup`  | `(ctx: SetupContext) => Promise<void> \| void`| Optional interaction steps. If omitted, the page is auto-analyzed after load. |
| `config` | `LaunchConfig`                                | Per-page override, merged over `defaults`.                       |

`SetupContext` gives you the live Playwright `page` and a `levelAnalyze(config?)` function you
can call whenever the page is in the state you want to scan.

### `BrowserConfig`

| Field           | Type                          | Notes                                          |
| --------------- | ----------------------------- | ---------------------------------------------- |
| `type`          | `'chromium' \| 'firefox' \| 'webkit'` | Engine to launch. Default `'chromium'`. |
| `launchOptions` | Playwright `LaunchOptions`    | Merged over `{ headless: true }`.              |

### `ManualPageResult`

| Field     | Type                   | Notes                                            |
| --------- | ---------------------- | ------------------------------------------------ |
| `url`     | `string`               | The URL this result is for.                      |
| `results` | `AnalysisResultData[]` | One entry per `levelAnalyze` call (auto or manual). |
| `error`   | `Error`                | Present if navigation/analysis failed for this page. |

**Config precedence:** a `levelAnalyze(override)` argument wins over per-page `config`, which
wins over top-level `defaults`.

## Examples

### 1. Simplest scan — a list of URLs

```ts
const results = await levelCiManual({
  defaults: { reportPath: './a11y-reports' },
  pages: ['https://example.com', 'https://example.com/about'],
})
```

Each URL is loaded and auto-analyzed once. `results` has one entry per page.

### 2. Per-page config override

```ts
const results = await levelCiManual({
  defaults: { reportPath: './a11y-reports' },
  pages: [
    { urls: ['https://example.com/checkout'], config: { reportPath: './reports/checkout' } },
  ],
})
```

### 3. Custom interaction before analyzing

```ts
const results = await levelCiManual({
  pages: [
    {
      urls: ['https://example.com'],
      setup: async ({ page, levelAnalyze }) => {
        await page.click('button#open-menu')
        await page.waitForSelector('.menu.expanded')
        await levelAnalyze({ reportPath: './reports/menu-open' })
      },
    },
  ],
})
```

When you provide `setup`, analysis is **not** run automatically — call `levelAnalyze()`
yourself once the page is in the state you want to scan.

### 4. Multiple scans in one flow

```ts
const results = await levelCiManual({
  pages: [
    {
      urls: ['https://example.com/wizard'],
      setup: async ({ page, levelAnalyze }) => {
        await levelAnalyze({ reportPath: './reports/step-1' })
        await page.click('text=Next')
        await levelAnalyze({ reportPath: './reports/step-2' })
      },
    },
  ],
})
// results[0].results has length 2 — one report per levelAnalyze call
```

### 5. Several URLs sharing one setup

```ts
const results = await levelCiManual({
  defaults: { reportPath: './a11y-reports' },
  pages: [{ urls: ['https://example.com/a', 'https://example.com/b'] }],
})
```

### 6. Dry run — skip analysis

```ts
const results = await levelCiManual({
  defaults: { reportPath: './a11y-reports', switchOff: true },
  pages: ['https://example.com'],
})
// results[0].results[0].report is undefined; no report files are written
```

### 7. Error handling

```ts
const results = await levelCiManual({
  pages: ['http://localhost:1'], // unreachable
})

if (results[0].error) {
  console.error('Scan failed:', results[0].error.message)
}
// A failing page does not stop the rest of the scan
```

### 8. Different browser engine / launch options

```ts
const results = await levelCiManual({
  browser: { type: 'firefox', launchOptions: { headless: true } },
  defaults: { reportPath: './a11y-reports' },
  pages: ['https://example.com'],
})
```

## Reading the results

```ts
for (const page of results) {
  if (page.error) continue
  for (const run of page.results) {
    console.log(page.url, run.report?.rules.length, 'rules evaluated')
  }
}
```

- `page.url` — the scanned URL.
- `page.results[n].report.rules` — accessibility rule outcomes (violations + passes).
- `page.error` — navigation/analysis failure for that page.
