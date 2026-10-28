import { expect, test } from "@playwright/test";
import { addCustomerButton, CUSTOMER, nameButton, openCustomers } from "./helpers";

test.describe("keyboard and focus on /customers", () => {
  test.beforeEach(async ({ page }) => {
    await openCustomers(page);
  });

  test("Enter on the customer name opens the details; Esc closes and returns focus to it", async ({ page }) => {
    const opener = nameButton(page, CUSTOMER);
    await opener.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: CUSTOMER });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Asiakkaan tiedot ja laskut");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("details tabs work with the arrow keys", async ({ page }) => {
    await nameButton(page, CUSTOMER).focus();
    await page.keyboard.press("Enter");
    const info = page.getByRole("tab", { name: "Perustiedot" });
    await info.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Laskut" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("2026-0361");
  });

  test("the Sulje button closes the details and returns focus to the name", async ({ page }) => {
    const opener = nameButton(page, CUSTOMER);
    await opener.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Sulje", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("new customer dialog: Enter opens, Esc closes, focus returns to Lisää asiakas", async ({ page }) => {
    const trigger = addCustomerButton(page);
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Lisää asiakas" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("new customer dialog: Peruuta closes it and returns focus to Lisää asiakas", async ({ page }) => {
    const trigger = addCustomerButton(page);
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Peruuta" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("failed validation focuses the first invalid field", async ({ page }) => {
    await addCustomerButton(page).focus();
    await page.keyboard.press("Enter");

    // Everything empty: the first field is invalid.
    await page.getByRole("button", { name: "Tallenna" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Yrityksen nimi")).toBeFocused();
    await expect(page.getByLabel("Yrityksen nimi")).toHaveAttribute("aria-invalid", "true");

    // Name filled, Y-tunnus malformed: focus moves to Y-tunnus.
    await page.getByLabel("Yrityksen nimi").fill("Testi Oy");
    await page.getByLabel("Y-tunnus").fill("123");
    await page.keyboard.press("Enter");
    const businessId = page.getByLabel("Y-tunnus");
    await expect(businessId).toBeFocused();
    await expect(businessId).toHaveAccessibleDescription(/Anna Y-tunnus muodossa 1234567-8\./);
    await expect(page.getByLabel("Yrityksen nimi")).not.toHaveAttribute("aria-invalid", "true");
  });

  test("a valid form saves, closes, focuses Lisää asiakas and shows the success message", async ({ page }) => {
    const trigger = addCustomerButton(page);
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.getByLabel("Yrityksen nimi").fill("Testi Oy");
    await page.getByLabel("Y-tunnus").fill("7654321-0");
    await page.getByLabel("Yhteyshenkilö").fill("Testi Henkilö");
    await page.getByLabel("Sähköposti").fill("testi@testi.example");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.getByText("Asiakas lisätty.")).toBeVisible();
    await expect(page.getByText("Näytetään 13 / 13 asiakasta")).toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("sorting with the keyboard updates aria-sort and the order", async ({ page }) => {
    const header = (name: string) => page.getByRole("columnheader", { name });
    const firstRowName = () => page.locator("tbody tr").first().getByRole("button");

    await expect(header("Asiakas")).toHaveAttribute("aria-sort", "ascending");
    await expect(header("Avoimet laskut")).toHaveAttribute("aria-sort", "none");

    await header("Avoimet laskut").getByRole("button").focus();
    await page.keyboard.press("Enter");
    await expect(header("Avoimet laskut")).toHaveAttribute("aria-sort", "ascending");
    await expect(header("Asiakas")).toHaveAttribute("aria-sort", "none");
    await expect(page.locator("tbody tr").first()).toContainText("0,00");

    await page.keyboard.press("Space");
    await expect(header("Avoimet laskut")).toHaveAttribute("aria-sort", "descending");
    await expect(firstRowName()).toHaveAccessibleName("Avaa tiedot: Joensuun Jäähdytys Oy");

    await header("Viimeisin lasku").getByRole("button").focus();
    await page.keyboard.press("Enter");
    await expect(header("Viimeisin lasku")).toHaveAttribute("aria-sort", "ascending");
    await expect(header("Avoimet laskut")).toHaveAttribute("aria-sort", "none");
    await expect(firstRowName()).toHaveAccessibleName("Avaa tiedot: Turun Tarvike Oy");
  });

  test("filters work with the keyboard and the count updates", async ({ page }) => {
    const search = page.getByLabel("Hae asiakasta");
    await search.focus();
    await page.keyboard.type("kala");
    await expect(page.getByText("Näytetään 1 / 12 asiakasta")).toBeVisible();

    await search.fill("");
    await page.getByRole("combobox", { name: "Tila" }).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("option", { name: "Erääntynyt" }).click();
    await expect(page.getByText("Näytetään 3 / 12 asiakasta")).toBeVisible();

    await search.fill("zzz");
    const clear = page.getByRole("button", { name: "Tyhjennä suodattimet" });
    await clear.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Näytetään 12 / 12 asiakasta")).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Tila" })).toHaveText("Kaikki");
  });
});
