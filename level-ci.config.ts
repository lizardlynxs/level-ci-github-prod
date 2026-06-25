import type { Config } from "@level-ci/cli";

export default {
  organization: "yelyzaveta-gorbunova-userway-org",
  project: "level-ci-github-prod-a11y-manual-test",
  token: process.env.LEVEL_CI_TOKEN,
  reportPaths: ["./level-ci-reports"],
} satisfies Config;
