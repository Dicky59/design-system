const currencyFormat = new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR" });

// ISO dates (yyyy-mm-dd) are parsed as UTC, so format in UTC to avoid a one-day shift.
const dateFormat = new Intl.DateTimeFormat("fi-FI", { timeZone: "UTC" });

/** Formats an amount as euros in Finnish style, e.g. `1 234,50 €`. */
export function formatCurrency(amount: number): string {
  return currencyFormat.format(amount);
}

/** Formats an ISO date (yyyy-mm-dd) in Finnish style, e.g. `28.10.2026`. */
export function formatDate(isoDate: string): string {
  return dateFormat.format(new Date(isoDate));
}
