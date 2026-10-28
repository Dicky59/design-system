"use client";

import {
  Badge,
  Button,
  DescriptionItem,
  DescriptionList,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/design-system/components";
import {
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUS_TONE,
  getInvoiceStatus,
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_TONE,
} from "./lib/customers";
import { formatCurrency, formatDate } from "./lib/format";
import type { Customer } from "./types";

type Props = {
  /** The customer to show, or null when the dialog is closed. */
  customer: Customer | null;
  onClose: () => void;
};

export function CustomerDetailsDialog({ customer, onClose }: Props) {
  return (
    <Dialog open={customer !== null} onOpenChange={(open) => !open && onClose()}>
      {customer ? (
        <DialogContent
          size="lg"
          title={customer.name}
          description="Asiakkaan tiedot ja laskut"
          closeLabel="Sulje asiakkaan tiedot"
        >
          <Tabs defaultValue="info">
            <TabsList label="Asiakkaan tiedot">
              <TabsTrigger value="info">Perustiedot</TabsTrigger>
              <TabsTrigger value="invoices">Laskut</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <DescriptionList>
                <DescriptionItem term="Y-tunnus">{customer.businessId}</DescriptionItem>
                <DescriptionItem term="Yhteyshenkilö">{customer.contactPerson}</DescriptionItem>
                <DescriptionItem term="Sähköposti">{customer.email}</DescriptionItem>
                <DescriptionItem term="Puhelin">{customer.phone || "–"}</DescriptionItem>
                <DescriptionItem term="Kaupunki">{customer.city || "–"}</DescriptionItem>
                <DescriptionItem term="Tila">
                  <Badge tone={CUSTOMER_STATUS_TONE[customer.status]}>{CUSTOMER_STATUS_LABEL[customer.status]}</Badge>
                </DescriptionItem>
              </DescriptionList>
            </TabsContent>
            <TabsContent value="invoices">
              <Table caption="Asiakkaan laskut" captionHidden>
                <TableHeader>
                  <TableRow>
                    <TableHead>Laskun numero</TableHead>
                    <TableHead>Eräpäivä</TableHead>
                    <TableHead numeric>Summa</TableHead>
                    <TableHead>Tila</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.invoices.length === 0 ? (
                    <TableEmpty colSpan={4}>Ei laskuja.</TableEmpty>
                  ) : (
                    customer.invoices.map((invoice) => {
                      const status = getInvoiceStatus(invoice);
                      return (
                        <TableRow key={invoice.number}>
                          <TableCell rowHeader>{invoice.number}</TableCell>
                          <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                          <TableCell numeric>{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>
                            <Badge tone={INVOICE_STATUS_TONE[status]}>{INVOICE_STATUS_LABEL[status]}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <DialogClose>
              <Button variant="secondary">Sulje</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
