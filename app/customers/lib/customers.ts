import { DEMO_TODAY } from "./demo";
import type {
  Customer,
  CustomerStatus,
  Invoice,
  InvoiceStatus,
  NewCustomerErrors,
  NewCustomerField,
  NewCustomerValues,
  SortDirection,
  SortKey,
  StatusFilter,
} from "../types";

type BadgeTone = "success" | "info" | "danger" | "neutral" | "warning";

export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  active: "Aktiivinen",
  new: "Uusi",
  overdue: "Erääntynyt",
  inactive: "Ei aktiivinen",
};

export const CUSTOMER_STATUS_TONE: Record<CustomerStatus, BadgeTone> = {
  active: "success",
  new: "info",
  overdue: "danger",
  inactive: "neutral",
};

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: "Maksettu",
  open: "Avoin",
  overdue: "Erääntynyt",
};

export const INVOICE_STATUS_TONE: Record<InvoiceStatus, BadgeTone> = {
  paid: "success",
  open: "warning",
  overdue: "danger",
};

export const CUSTOMER_STATUSES: CustomerStatus[] = ["active", "new", "overdue", "inactive"];

/** Invoice state on a given day. Paid wins; otherwise overdue once the due date has passed. */
export function getInvoiceStatus(invoice: Invoice, today: string = DEMO_TODAY): InvoiceStatus {
  if (invoice.paid) return "paid";
  return invoice.dueDate < today ? "overdue" : "open";
}

export type CustomerFilters = { query: string; status: StatusFilter };

/** Filters by name or business ID (case-insensitive, trimmed) and by status. */
export function filterCustomers(customers: Customer[], { query, status }: CustomerFilters): Customer[] {
  const needle = query.trim().toLowerCase();
  return customers.filter((customer) => {
    if (status !== "all" && customer.status !== status) return false;
    if (!needle) return true;
    return customer.name.toLowerCase().includes(needle) || customer.businessId.toLowerCase().includes(needle);
  });
}

/** Returns a sorted copy. Customers without an invoice date always sort last. Ties fall back to name. */
export function sortCustomers(customers: Customer[], key: SortKey, direction: SortDirection): Customer[] {
  const factor = direction === "ascending" ? 1 : -1;
  const byName = (a: Customer, b: Customer) => a.name.localeCompare(b.name, "fi");
  return [...customers].sort((a, b) => {
    let result = 0;
    if (key === "name") {
      result = byName(a, b) * factor;
    } else if (key === "openInvoicesTotal") {
      result = (a.openInvoicesTotal - b.openInvoicesTotal) * factor;
    } else {
      if (a.lastInvoiceDate === null && b.lastInvoiceDate === null) return byName(a, b);
      if (a.lastInvoiceDate === null) return 1;
      if (b.lastInvoiceDate === null) return -1;
      result = a.lastInvoiceDate.localeCompare(b.lastInvoiceDate) * factor;
    }
    return result !== 0 ? result : byName(a, b);
  });
}

export const ERROR_REQUIRED = "Tämä kenttä on pakollinen.";
export const ERROR_BUSINESS_ID = "Anna Y-tunnus muodossa 1234567-8.";
export const ERROR_EMAIL = "Anna kelvollinen sähköpostiosoite.";

const BUSINESS_ID_PATTERN = /^\d{7}-\d$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Field order of the new customer form; the first invalid one receives focus. */
export const NEW_CUSTOMER_FIELD_ORDER: NewCustomerField[] = [
  "name",
  "businessId",
  "contactPerson",
  "email",
  "phone",
  "city",
  "status",
];

export function isValidBusinessId(value: string): boolean {
  return BUSINESS_ID_PATTERN.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** Validates the new customer form. An empty result means the values are valid. */
export function validateNewCustomer(values: NewCustomerValues): NewCustomerErrors {
  const errors: NewCustomerErrors = {};
  if (!values.name.trim()) errors.name = ERROR_REQUIRED;
  if (!values.businessId.trim()) errors.businessId = ERROR_REQUIRED;
  else if (!isValidBusinessId(values.businessId)) errors.businessId = ERROR_BUSINESS_ID;
  if (!values.contactPerson.trim()) errors.contactPerson = ERROR_REQUIRED;
  if (!values.email.trim()) errors.email = ERROR_REQUIRED;
  else if (!isValidEmail(values.email)) errors.email = ERROR_EMAIL;
  return errors;
}

/** First field with an error, in form order. */
export function firstInvalidField(errors: NewCustomerErrors): NewCustomerField | undefined {
  return NEW_CUSTOMER_FIELD_ORDER.find((field) => errors[field] !== undefined);
}

/** Builds a customer from valid form values. A new customer has no invoices yet. */
export function createCustomer(values: NewCustomerValues, id: string): Customer {
  return {
    id,
    name: values.name.trim(),
    businessId: values.businessId.trim(),
    contactPerson: values.contactPerson.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    city: values.city.trim(),
    status: values.status,
    openInvoicesTotal: 0,
    lastInvoiceDate: null,
    invoices: [],
  };
}
