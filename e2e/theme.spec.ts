import { expect, test } from "@playwright/test";
import { openCustomers } from "./helpers";

const html = "html";

test.describe("theme selector", () => {
  test("starts in the default theme", async ({ page }) => {
    await openCustomers(page);
    await expect(page.getByRole("combobox", { name: "Teema" })).toHaveText("Oletus");
    await expect(page.locator(html)).not.toHaveAttribute("data-theme", /forest|dark/);
  });

  test("changing the theme applies it and saves it", async ({ page }) => {
    await openCustomers(page);
    await page.getByRole("combobox", { name: "Teema" }).click();
    await page.getByRole("option", { name: "Tumma" }).click();
    await expect(page.locator(html)).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("combobox", { name: "Teema" })).toHaveText("Tumma");
    expect(await page.evaluate(() => localStorage.getItem("ds-theme"))).toBe("dark");
    // Page background follows the semantic surface token of the dark theme (neutral 900).
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(15, 23, 42)");
  });

  test("the theme can be changed with the keyboard", async ({ page }) => {
    await openCustomers(page);
    await page.getByRole("combobox", { name: "Teema" }).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("option", { name: "Metsä" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(html)).toHaveAttribute("data-theme", "forest");
    await expect(page.getByRole("combobox", { name: "Teema" })).toBeFocused();
  });

  test("the saved theme is applied before the first paint (no flash)", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("ds-theme", "dark"));
    // Record what the document looked like when parsing finished, before React could hydrate it.
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        (window as unknown as { __early: string[] }).__early = [
          document.documentElement.getAttribute("data-theme") ?? "none",
          getComputedStyle(document.body).backgroundColor,
        ];
      });
    });
    await openCustomers(page);
    const early = await page.evaluate(() => (window as unknown as { __early: string[] }).__early);
    expect(early).toEqual(["dark", "rgb(15, 23, 42)"]);
    await expect(page.getByRole("combobox", { name: "Teema" })).toHaveText("Tumma");
  });

  test("an unknown saved value is ignored", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("ds-theme", "neon"));
    await openCustomers(page);
    await expect(page.locator(html)).not.toHaveAttribute("data-theme", /.+/);
    await expect(page.getByRole("combobox", { name: "Teema" })).toHaveText("Oletus");
  });
});
