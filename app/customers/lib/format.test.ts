import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "./format";

// Intl uses non-breaking spaces; compare with plain spaces for readability.
const plain = (text: string) => text.replace(/[  ]/g, " ");

describe("formatCurrency", () => {
  it("formats euros with a decimal comma and the euro sign after the amount", () => {
    expect(plain(formatCurrency(1234.5))).toBe("1 234,50 €");
  });

  it("shows zero with two decimals", () => {
    expect(plain(formatCurrency(0))).toBe("0,00 €");
  });

  it("formats large amounts with space as thousands separator", () => {
    expect(plain(formatCurrency(9120))).toBe("9 120,00 €");
  });
});

describe("formatDate", () => {
  it("formats as d.M.yyyy", () => {
    expect(formatDate("2026-10-28")).toBe("28.10.2026");
    expect(formatDate("2026-01-05")).toBe("5.1.2026");
  });

  it("does not shift the day across time zones", () => {
    expect(formatDate("2026-01-01")).toBe("1.1.2026");
    expect(formatDate("2026-12-31")).toBe("31.12.2026");
  });
});
