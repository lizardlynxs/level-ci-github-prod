import { levelSetup } from '@level-ci/a11y-playwright';

export default async function globalSetup() {
  levelSetup({
    reportPath: './level-ci-reports',
  });
}
