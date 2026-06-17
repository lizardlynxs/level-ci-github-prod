# Sample Project with Level CI Accessibility Testing

This project demonstrates how to integrate **Level CI accessibility analysis** into a web application using **Playwright**, and **GitHub Actions**.

---

## 🔍 Adding Level CI Accessibility Analysis

1. **Configure the `.npmrc` file**

   - Refer to the setup instructions in Level CI.

2. **Install the Level CI playwright package**

   ```bash
   npm install --save-dev @level-ci/a11y-playwright
   ```

3. **Update the playwright support file**

   - Include Level CI setup (refer to setup steps).

4. **Add Level CI analysis calls**

   - Add `levelAnalyze()` in your playwright tests where accessibility analysis is required.

5. **Configure optional settings**

   - Add TypeScript configuration if needed.
   - Update `.gitignore` to exclude reports.

6. **Verify local setup**
   - Run your e2e tests locally.
   - Confirm reports appear in the `level-ci-reports` directory.
   - Ensure the number of reports matches the number of analysis calls.

⚠️ **Important:** Ensure the Level CI token is correctly configured for reports to be generated.

---

## 🔗 GitHub Workflow Integration

1. Add a **repository secret** in GitHub for the Level CI token.
2. Install the **Level CI CLI**.
3. Create the `level-ci.config.ts` file with project metadata.
4. Update the **GitHub workflow** to include the Level CI accessibility analysis step.
5. Verify the CI/CD setup locally before committing.

---

## 🚀 Setting up the Project

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

App URL: [http://localhost:1342](http://localhost:1342)

Open the app in the browser at the provided local URL.

---

## ✅ End-to-End Tests

### Playwright Tests

Install browser dependencies:

```bash
npx playwright install chromium
```

Run the Playwright test suite:

```bash
npm run test:playwright
```

**Documentation**: See the full details in the [docs](https://docs.cicd.userway.org/get-started/connect-repository/github) directory

---
