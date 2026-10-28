"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Page,
  PageHeader,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/design-system/components";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
import { MOCK_CUSTOMERS } from "./data/customers";
import { NewCustomerDialog } from "./NewCustomerDialog";
import {
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUS_TONE,
  CUSTOMER_STATUSES,
  createCustomer,
  filterCustomers,
  sortCustomers,
} from "./lib/customers";
import { formatCurrency, formatDate } from "./lib/format";
import type { Customer, NewCustomerValues, SortDirection, SortKey, StatusFilter } from "./types";

const LOAD_DELAY_MS = 500;
const COLUMN_COUNT = 6;
const SKELETON_ROWS = 5;

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Kaikki" },
  ...CUSTOMER_STATUSES.map((status) => ({ value: status, label: CUSTOMER_STATUS_LABEL[status] })),
];

type LoadState = "loading" | "ready" | "error";

type Props = {
  /** Simulates a failed load on the first attempt (`?state=error`). */
  forceError: boolean;
};

export function CustomersView({ forceError }: Props) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: "name",
    direction: "ascending",
  });
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showAdded, setShowAdded] = useState(false);
  // The details dialog has no trigger element, so remember the opener and return focus to it on close.
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadState(forceError && attempt === 0 ? "error" : "ready");
    }, LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [attempt, forceError]);

  const visible = useMemo(
    () => sortCustomers(filterCustomers(customers, { query, status: statusFilter }), sort.key, sort.direction),
    [customers, query, statusFilter, sort],
  );

  const toggleSort = (key: SortKey) =>
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "ascending" ? "descending" : "ascending",
    }));

  const sortDirectionOf = (key: SortKey) => (sort.key === key ? sort.direction : "none");

  const openDetails = (customer: Customer, opener: HTMLElement) => {
    openerRef.current = opener;
    setSelected(customer);
  };

  const closeDetails = () => {
    setSelected(null);
    setTimeout(() => openerRef.current?.focus(), 0);
  };

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("all");
  };

  const retry = () => {
    setLoadState("loading");
    setAttempt((current) => current + 1);
  };

  const addCustomer = (values: NewCustomerValues) => {
    setCustomers((current) => [...current, createCustomer(values, `c-${String(current.length + 1).padStart(3, "0")}`)]);
    setShowAdded(true);
  };

  return (
    <Page>
      <PageHeader title="Asiakkaat">
        <NewCustomerDialog onCreate={addCustomer} />
      </PageHeader>

      {showAdded ? (
        <Alert tone="success" onDismiss={() => setShowAdded(false)}>
          Asiakas lisätty.
        </Alert>
      ) : null}

      {loadState === "error" ? (
        <Alert tone="danger">
          <Stack gap="3" align="start">
            <span>Asiakkaiden lataus epäonnistui.</span>
            <Button variant="secondary" size="sm" onClick={retry}>
              Yritä uudelleen
            </Button>
          </Stack>
        </Alert>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle level={2}>Suodattimet</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack switchAt="md" fill>
                <Input
                  label="Hae asiakasta"
                  hint="Nimi tai Y-tunnus"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Select
                  label="Tila"
                  options={STATUS_FILTER_OPTIONS}
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack gap="3">
                <Table caption="Asiakaslista">
                  <TableHeader>
                    <TableRow>
                      <TableHead sortDirection={sortDirectionOf("name")} onSort={() => toggleSort("name")}>
                        Asiakas
                      </TableHead>
                      <TableHead>Yhteyshenkilö</TableHead>
                      <TableHead>Tila</TableHead>
                      <TableHead
                        numeric
                        sortDirection={sortDirectionOf("openInvoicesTotal")}
                        onSort={() => toggleSort("openInvoicesTotal")}
                      >
                        Avoimet laskut
                      </TableHead>
                      <TableHead
                        sortDirection={sortDirectionOf("lastInvoiceDate")}
                        onSort={() => toggleSort("lastInvoiceDate")}
                      >
                        Viimeisin lasku
                      </TableHead>
                      <TableHead>Toiminnot</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadState === "loading" ? (
                      Array.from({ length: SKELETON_ROWS }, (_, row) => (
                        <TableRow key={row}>
                          {Array.from({ length: COLUMN_COUNT }, (_, column) => (
                            <TableCell key={column}>
                              <Skeleton
                                width={column === 0 ? "lg" : "md"}
                                label={row === 0 && column === 0 ? "Ladataan asiakkaita..." : undefined}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : visible.length === 0 ? (
                      <TableEmpty colSpan={COLUMN_COUNT}>
                        <Stack gap="3" align="center">
                          <span>Ei hakua vastaavia asiakkaita.</span>
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Tyhjennä suodattimet
                          </Button>
                        </Stack>
                      </TableEmpty>
                    ) : (
                      visible.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell rowHeader>
                            <Stack gap="1">
                              <span>{customer.name}</span>
                              <span className="text-sm font-regular text-content-muted">{customer.businessId}</span>
                            </Stack>
                          </TableCell>
                          <TableCell>{customer.contactPerson}</TableCell>
                          <TableCell>
                            <Badge tone={CUSTOMER_STATUS_TONE[customer.status]}>
                              {CUSTOMER_STATUS_LABEL[customer.status]}
                            </Badge>
                          </TableCell>
                          <TableCell numeric>{formatCurrency(customer.openInvoicesTotal)}</TableCell>
                          <TableCell>
                            {customer.lastInvoiceDate ? formatDate(customer.lastInvoiceDate) : "–"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label={`Avaa tiedot: ${customer.name}`}
                              onClick={(event) => openDetails(customer, event.currentTarget)}
                            >
                              Avaa tiedot
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {loadState === "ready" ? (
                  <p className="text-sm text-content-muted" aria-live="polite">
                    Näytetään {visible.length} / {customers.length} asiakasta
                  </p>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        </>
      )}

      <CustomerDetailsDialog customer={selected} onClose={closeDetails} />
    </Page>
  );
}
