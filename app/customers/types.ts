export type CustomerStatus = "active" | "new" | "overdue" | "inactive";

export type Invoice = {
  number: string;
  dueDate: string; // ISO date
  amount: number; // EUR
  paid: boolean;
};

export type InvoiceStatus = "paid" | "open" | "overdue";

export type Customer = {
  id: string;
  name: string;
  businessId: string; // Y-tunnus, format 1234567-8
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
  openInvoicesTotal: number; // EUR
  lastInvoiceDate: string | null; // ISO date
  invoices: Invoice[];
};

export type StatusFilter = "all" | CustomerStatus;

export type SortKey = "name" | "openInvoicesTotal" | "lastInvoiceDate";
export type SortDirection = "ascending" | "descending";

export type NewCustomerValues = {
  name: string;
  businessId: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
};

export type NewCustomerField = keyof NewCustomerValues;
export type NewCustomerErrors = Partial<Record<NewCustomerField, string>>;
