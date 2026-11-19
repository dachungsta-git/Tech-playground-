import {defineConfig} from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.mjs",
  use: {
    browserName: "chromium",
    launchOptions: process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {},
    trace: "retain-on-failure",
  },
  forbidOnly: Boolean(process.env.CI),
});
