import { describe, expect, it } from "vitest";
import { MOCK_CUSTOMERS } from "../data/customers";
import type { Customer, NewCustomerValues } from "../types";
import {
  createCustomer,
  DEFAULT_FILTERS,
  ERROR_BUSINESS_ID,
  ERROR_EMAIL,
  ERROR_REQUIRED,
  filterCustomers,
  firstInvalidField,
  getInvoiceStatus,
  sortCustomers,
  validateNewCustomer,
} from "./customers";
import { DEMO_TODAY } from "./demo";

const names = (customers: Customer[]) => customers.map((c) => c.name);

describe("getInvoiceStatus", () => {
  it("is paid when paid, even if the due date has passed", () => {
    expect(getInvoiceStatus({ number: "1", dueDate: "2020-01-01", amount: 10, paid: true })).toBe("paid");
  });

  it("is open when unpaid and due after today", () => {
    expect(getInvoiceStatus({ number: "1", dueDate: "2026-10-29", amount: 10, paid: false })).toBe("open");
  });

  it("is open on the due date itself", () => {
    expect(getInvoiceStatus({ number: "1", dueDate: DEMO_TODAY, amount: 10, paid: false })).toBe("open");
  });

  it("is overdue when unpaid and the due date is before today", () => {
    expect(getInvoiceStatus({ number: "1", dueDate: "2026-10-27", amount: 10, paid: false })).toBe("overdue");
  });

  it("uses the given day instead of the demo date", () => {
    const invoice = { number: "1", dueDate: "2026-11-12", amount: 10, paid: false };
    expect(getInvoiceStatus(invoice, "2026-11-13")).toBe("overdue");
    expect(getInvoiceStatus(invoice)).toBe("open");
  });
});

describe("DEFAULT_FILTERS", () => {
  it("shows all customers: empty query and status Kaikki", () => {
    expect(DEFAULT_FILTERS).toEqual({ query: "", status: "all" });
    expect(filterCustomers(MOCK_CUSTOMERS, DEFAULT_FILTERS)).toHaveLength(MOCK_CUSTOMERS.length);
  });
});

describe("filterCustomers", () => {
  it("returns everything for an empty query and status all", () => {
    expect(filterCustomers(MOCK_CUSTOMERS, { query: "", status: "all" })).toHaveLength(12);
  });

  it("matches the name case-insensitively and ignores surrounding spaces", () => {
    expect(names(filterCustomers(MOCK_CUSTOMERS, { query: "  KALA ", status: "all" }))).toEqual(["Kaakon Kala Oy"]);
  });

  it("matches the business ID", () => {
    expect(names(filterCustomers(MOCK_CUSTOMERS, { query: "3456789", status: "all" }))).toEqual([
      "Länsi-Suomen Rakennus Oy",
    ]);
  });

  it("filters by status", () => {
    const overdue = filterCustomers(MOCK_CUSTOMERS, { query: "", status: "overdue" });
    expect(overdue).toHaveLength(3);
    expect(overdue.every((c) => c.status === "overdue")).toBe(true);
  });

  it("combines query and status", () => {
    expect(filterCustomers(MOCK_CUSTOMERS, { query: "oy", status: "inactive" })).toHaveLength(2);
    expect(filterCustomers(MOCK_CUSTOMERS, { query: "kala", status: "overdue" })).toHaveLength(0);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterCustomers(MOCK_CUSTOMERS, { query: "ei löydy", status: "all" })).toEqual([]);
  });
});

describe("sortCustomers", () => {
  it("sorts by name with Finnish collation, both directions", () => {
    const asc = names(sortCustomers(MOCK_CUSTOMERS, "name", "ascending"));
    expect(asc[0]).toBe("Aallon Design Oy");
    expect(asc.at(-1)).toBe("Vaasan Verkkopalvelut Oy");
    expect(names(sortCustomers(MOCK_CUSTOMERS, "name", "descending"))).toEqual([...asc].reverse());
  });

  it("sorts by open invoices total", () => {
    const desc = sortCustomers(MOCK_CUSTOMERS, "openInvoicesTotal", "descending");
    expect(desc[0].name).toBe("Joensuun Jäähdytys Oy");
    const asc = sortCustomers(MOCK_CUSTOMERS, "openInvoicesTotal", "ascending");
    expect(asc[0].openInvoicesTotal).toBe(0);
    expect(asc.at(-1)?.openInvoicesTotal).toBe(9120);
  });

  it("sorts by last invoice date and always puts missing dates last", () => {
    const asc = sortCustomers(MOCK_CUSTOMERS, "lastInvoiceDate", "ascending");
    expect(asc[0].name).toBe("Turun Tarvike Oy");
    expect(asc.at(-1)?.lastInvoiceDate).toBeNull();
    const desc = sortCustomers(MOCK_CUSTOMERS, "lastInvoiceDate", "descending");
    expect(desc[0].name).toBe("Hämeen Leipomo Oy");
    expect(desc.at(-1)?.lastInvoiceDate).toBeNull();
  });

  it("breaks ties by name", () => {
    const sorted = sortCustomers(MOCK_CUSTOMERS, "openInvoicesTotal", "ascending");
    const zeroes = sorted.filter((c) => c.openInvoicesTotal === 0);
    expect(names(zeroes)).toEqual([...names(zeroes)].sort((a, b) => a.localeCompare(b, "fi")));
  });

  it("does not mutate the input", () => {
    const before = names(MOCK_CUSTOMERS);
    sortCustomers(MOCK_CUSTOMERS, "name", "descending");
    expect(names(MOCK_CUSTOMERS)).toEqual(before);
  });
});

const validValues: NewCustomerValues = {
  name: "Testi Oy",
  businessId: "1234567-8",
  contactPerson: "Testi Henkilö",
  email: "testi@testi.example",
  phone: "",
  city: "",
  status: "new",
};

describe("validateNewCustomer", () => {
  it("accepts valid values with optional fields empty", () => {
    expect(validateNewCustomer(validValues)).toEqual({});
  });

  it("requires name, business ID, contact person and email", () => {
    const errors = validateNewCustomer({ ...validValues, name: " ", businessId: "", contactPerson: "", email: "" });
    expect(errors).toEqual({
      name: ERROR_REQUIRED,
      businessId: ERROR_REQUIRED,
      contactPerson: ERROR_REQUIRED,
      email: ERROR_REQUIRED,
    });
  });

  it("rejects a malformed business ID", () => {
    for (const businessId of ["12345678", "123456-78", "1234567-89", "abcdefg-h", "1234567 8"]) {
      expect(validateNewCustomer({ ...validValues, businessId }).businessId).toBe(ERROR_BUSINESS_ID);
    }
  });

  it("rejects a malformed email", () => {
    for (const email of ["testi", "testi@", "@testi.fi", "testi@testi", "te sti@testi.fi"]) {
      expect(validateNewCustomer({ ...validValues, email }).email).toBe(ERROR_EMAIL);
    }
  });
});

describe("firstInvalidField", () => {
  it("returns the first error in form order", () => {
    expect(firstInvalidField({ email: ERROR_EMAIL, businessId: ERROR_BUSINESS_ID })).toBe("businessId");
  });

  it("returns undefined without errors", () => {
    expect(firstInvalidField({})).toBeUndefined();
  });
});

describe("createCustomer", () => {
  it("trims values and starts without invoices", () => {
    const customer = createCustomer({ ...validValues, name: "  Testi Oy ", city: " Oulu " }, "c-100");
    expect(customer).toMatchObject({
      id: "c-100",
      name: "Testi Oy",
      city: "Oulu",
      status: "new",
      openInvoicesTotal: 0,
      lastInvoiceDate: null,
      invoices: [],
    });
  });
});

describe("mock data", () => {
  it("has 12 customers with unique ids and valid business IDs", () => {
    expect(MOCK_CUSTOMERS).toHaveLength(12);
    expect(new Set(MOCK_CUSTOMERS.map((c) => c.id)).size).toBe(12);
    for (const customer of MOCK_CUSTOMERS) expect(validateNewCustomer({ ...customer }).businessId).toBeUndefined();
  });

  it("covers every status, one customer without invoices and one overdue", () => {
    expect(new Set(MOCK_CUSTOMERS.map((c) => c.status))).toEqual(new Set(["active", "new", "overdue", "inactive"]));
    expect(MOCK_CUSTOMERS.some((c) => c.invoices.length === 0)).toBe(true);
  });

  it("keeps the open total equal to the unpaid invoices", () => {
    for (const customer of MOCK_CUSTOMERS) {
      const unpaid = customer.invoices.filter((i) => !i.paid).reduce((sum, i) => sum + i.amount, 0);
      expect(customer.openInvoicesTotal, customer.name).toBeCloseTo(unpaid, 2);
    }
  });

  it("keeps customer status consistent with invoices on the demo date", () => {
    for (const customer of MOCK_CUSTOMERS) {
      const hasOverdue = customer.invoices.some((i) => getInvoiceStatus(i) === "overdue");
      expect(hasOverdue, customer.name).toBe(customer.status === "overdue");
    }
  });

  it("has no invoice date after the demo date and none without invoices", () => {
    for (const customer of MOCK_CUSTOMERS) {
      if (customer.invoices.length === 0) expect(customer.lastInvoiceDate).toBeNull();
      else expect(customer.lastInvoiceDate! <= DEMO_TODAY, customer.name).toBe(true);
    }
  });
});
