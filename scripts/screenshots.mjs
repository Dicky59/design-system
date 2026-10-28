// Captures /customers at real viewport sizes (375 px and 1280 px) into docs/screenshots/,
// including the default view in every theme from tokens.json.
// Builds and starts the production app itself. Usage: npm run screenshots
//
// Deterministic output: fixed demo data (DEMO_TODAY), reduced motion + animations disabled,
// system font stack (no web fonts), fonts awaited before every capture, fixed locale and time zone.
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "docs", "screenshots");
const PORT = 3100;
const BASE = `http://localhost:${PORT}`;
const themeIds = Object.keys(JSON.parse(fs.readFileSync(path.join(root, "design-system/tokens/tokens.json"), "utf8")).themes);
const CUSTOMER = "Länsi-Suomen Rakennus Oy"; // has an overdue invoice, good for the invoices tab

const viewports = [
  { name: "375", width: 375, height: 812, scale: 2 },
  { name: "1280", width: 1280, height: 800, scale: 1 },
];

execSync("npm run build", { cwd: root, stdio: "inherit" });

const server = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "start", "-p", String(PORT)], {
  cwd: root,
  stdio: "inherit",
});
const stopServer = () => {
  if (!server.killed) server.kill();
};
process.on("exit", stopServer);
process.on("SIGINT", () => process.exit(1));

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`${BASE}/customers`);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Server did not start");
}

async function capture(page, file, options = {}) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.join(outDir, file),
    animations: "disabled",
    caret: "hide",
    ...options,
  });
  console.log(`saved docs/screenshots/${file}`);
}

async function openLoaded(page, query = "") {
  await page.goto(`${BASE}/customers${query}`);
  if (query.includes("error")) await page.getByRole("alert").waitFor();
  else await page.getByText(/Näytetään \d+ \/ \d+ asiakasta/).waitFor();
}

fs.mkdirSync(outDir, { recursive: true });

try {
  await waitForServer();
  const browser = await chromium.launch();
  for (const { name, width, height, scale } of viewports) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: scale,
      reducedMotion: "reduce",
      locale: "fi-FI",
      timezoneId: "Europe/Helsinki",
    });
    const page = await context.newPage();

    await openLoaded(page);
    await capture(page, `customers-default-${name}.png`, { fullPage: true });

    await page.getByRole("button", { name: `Avaa tiedot: ${CUSTOMER}` }).click();
    await page.getByRole("dialog").waitFor();
    await capture(page, `customers-details-info-${name}.png`);
    await page.getByRole("tab", { name: "Laskut" }).click();
    await capture(page, `customers-details-invoices-${name}.png`);
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "detached" });

    await page.getByRole("button", { name: "Lisää asiakas" }).click();
    await page.getByRole("dialog").waitFor();
    await page.getByLabel("Y-tunnus").fill("123");
    await page.getByLabel("Sähköposti").fill("wrong");
    await page.getByRole("button", { name: "Tallenna" }).click();
    await page.getByText("Anna Y-tunnus muodossa 1234567-8.").waitFor();
    await capture(page, `customers-new-customer-errors-${name}.png`);

    await openLoaded(page);
    await page.getByLabel("Hae asiakasta").fill("zzz");
    await page.getByText("Ei hakua vastaavia asiakkaita.").waitFor();
    await capture(page, `customers-empty-${name}.png`, { fullPage: true });

    await openLoaded(page, "?state=error");
    await capture(page, `customers-error-${name}.png`, { fullPage: true });

    // The default view in every theme (the theme is saved in localStorage, like the selector does).
    for (const theme of themeIds) {
      await page.evaluate((id) => localStorage.setItem("ds-theme", id), theme);
      await openLoaded(page);
      await page.getByRole("combobox", { name: "Teema" }).waitFor();
      await capture(page, `customers-theme-${theme}-${name}.png`, { fullPage: true });
    }
    await page.evaluate(() => localStorage.removeItem("ds-theme"));

    await context.close();
  }
  await browser.close();
} finally {
  stopServer();
}
