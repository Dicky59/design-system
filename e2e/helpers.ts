import { expect, type Page } from "@playwright/test";

export const CUSTOMER = "Länsi-Suomen Rakennus Oy";

/** Opens /customers and waits until the simulated load has finished (or the error state is shown). */
export async function openCustomers(page: Page, query = "") {
  await page.goto(`/customers${query}`);
  if (query.includes("state=error")) await expect(page.getByRole("alert")).toBeVisible();
  else await expect(page.getByText(/Näytetään \d+ \/ \d+ asiakasta/)).toBeVisible();
}

export const nameButton = (page: Page, name = CUSTOMER) => page.getByRole("button", { name: `Avaa tiedot: ${name}` });

export const addCustomerButton = (page: Page) => page.getByRole("button", { name: "Lisää asiakas" });

/** Saves the theme the way the selector does, before the page loads (also exercises the no-flash script). */
export async function useTheme(page: Page, theme: string) {
  await page.addInitScript((id) => localStorage.setItem("ds-theme", id), theme);
}
