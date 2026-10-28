import { defineConfig } from "@playwright/test";

// End-to-end tests run against the production build, at real viewport sizes (no device emulation, no iframes).
const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "fi-FI",
    timezoneId: "Europe/Helsinki",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "mobile-375", use: { browserName: "chromium", viewport: { width: 375, height: 812 } } },
    { name: "desktop-1280", use: { browserName: "chromium", viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    command: `npm run build && node node_modules/next/dist/bin/next start -p ${PORT}`,
    url: `http://localhost:${PORT}/customers`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});
