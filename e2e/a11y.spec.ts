import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { THEMES } from "../design-system/tokens/themes.generated";
import { addCustomerButton, CUSTOMER, nameButton, openCustomers, useTheme } from "./helpers";

// WCAG 2.2 AA plus best practices, on the live page at both widths.
async function expectNoViolations(page: Page, theme: string) {
  // Guard against testing the wrong theme: the saved theme must really be applied.
  if (theme !== "default") await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  const summary = results.violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map((node) => node.target.join(" ")),
  }));
  expect(summary, "axe violations").toEqual([]);
}

test("canary: axe reports a real violation", async ({ page }) => {
  // Guards against a vacuous pass: if axe silently stopped running, this would fail.
  await page.setContent('<main><img src="x.png"></main>');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.map((violation) => violation.id)).toContain("image-alt");
});

// Every state in every theme (themes come from tokens.json), at both viewport widths.
for (const { id: theme } of THEMES) {
  test.describe(`axe on /customers, theme ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await useTheme(page, theme);
    });

    test("default state", async ({ page }) => {
      await openCustomers(page);
      await expectNoViolations(page, theme);
    });

    test("loading state", async ({ page }) => {
      await page.goto("/customers");
      await expect(page.getByRole("status")).toBeAttached();
      await expectNoViolations(page, theme);
    });

    test("details dialog, both tabs", async ({ page }) => {
      await openCustomers(page);
      await nameButton(page, CUSTOMER).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expectNoViolations(page, theme);
      await page.getByRole("tab", { name: "Laskut" }).click();
      await expect(page.getByRole("tabpanel")).toContainText("Asiakkaan laskut");
      await expectNoViolations(page, theme);
    });

    test("new customer dialog, empty and with validation errors", async ({ page }) => {
      await openCustomers(page);
      await addCustomerButton(page).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expectNoViolations(page, theme);
      await page.getByRole("button", { name: "Tallenna" }).click();
      await expect(page.getByText("Tämä kenttä on pakollinen.").first()).toBeVisible();
      await expectNoViolations(page, theme);
    });

    test("empty state", async ({ page }) => {
      await openCustomers(page);
      await page.getByLabel("Hae asiakasta").fill("zzz");
      await expect(page.getByText("Ei hakua vastaavia asiakkaita.")).toBeVisible();
      await expectNoViolations(page, theme);
    });

    test("error state", async ({ page }) => {
      await openCustomers(page, "?state=error");
      await expectNoViolations(page, theme);
    });

    test("success alert after adding a customer", async ({ page }) => {
      await openCustomers(page);
      await addCustomerButton(page).click();
      await page.getByLabel("Yrityksen nimi").fill("Testi Oy");
      await page.getByLabel("Y-tunnus").fill("7654321-0");
      await page.getByLabel("Yhteyshenkilö").fill("Testi Henkilö");
      await page.getByLabel("Sähköposti").fill("testi@testi.example");
      await page.getByRole("button", { name: "Tallenna" }).click();
      await expect(page.getByText("Asiakas lisätty.")).toBeVisible();
      await expectNoViolations(page, theme);
    });
  });
}
