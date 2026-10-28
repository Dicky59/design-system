"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  Input,
  Select,
  Stack,
} from "@/design-system/components";
import {
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUSES,
  firstInvalidField,
  validateNewCustomer,
} from "./lib/customers";
import type { CustomerStatus, NewCustomerErrors, NewCustomerField, NewCustomerValues } from "./types";

const SAVE_DELAY_MS = 600;

const EMPTY_VALUES: NewCustomerValues = {
  name: "",
  businessId: "",
  contactPerson: "",
  email: "",
  phone: "",
  city: "",
  status: "new",
};

const STATUS_OPTIONS = CUSTOMER_STATUSES.map((status) => ({ value: status, label: CUSTOMER_STATUS_LABEL[status] }));

const fieldId = (field: NewCustomerField) => `new-customer-${field}`;

type Props = {
  onCreate: (values: NewCustomerValues) => void;
};

/** The "Lisää asiakas" button and the dialog with the new customer form. */
export function NewCustomerDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<NewCustomerValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<NewCustomerErrors>({});
  const [saving, setSaving] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const handleOpenChange = (next: boolean) => {
    if (!next && saving) return;
    if (next) {
      setValues(EMPTY_VALUES);
      setErrors({});
    }
    setOpen(next);
  };

  const setField = <K extends NewCustomerField>(field: K, value: NewCustomerValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const nextErrors = validateNewCustomer(values);
    setErrors(nextErrors);
    const invalid = firstInvalidField(nextErrors);
    if (invalid) {
      document.getElementById(fieldId(invalid))?.focus();
      return;
    }
    setSaving(true);
    saveTimer.current = setTimeout(() => {
      setSaving(false);
      setOpen(false);
      onCreate(values);
    }, SAVE_DELAY_MS);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button>Lisää asiakas</Button>
      </DialogTrigger>
      <DialogContent title="Lisää asiakas" description="Täytä asiakkaan perustiedot.">
        <form noValidate onSubmit={handleSubmit}>
          <Stack gap="4">
            <p className="text-sm text-content-muted">Tähdellä (*) merkityt kentät ovat pakollisia.</p>
            <Input
              id={fieldId("name")}
              label="Yrityksen nimi"
              required
              autoComplete="organization"
              value={values.name}
              error={errors.name}
              onChange={(event) => setField("name", event.target.value)}
            />
            <Input
              id={fieldId("businessId")}
              label="Y-tunnus"
              hint="Muodossa 1234567-8"
              required
              value={values.businessId}
              error={errors.businessId}
              onChange={(event) => setField("businessId", event.target.value)}
            />
            <Input
              id={fieldId("contactPerson")}
              label="Yhteyshenkilö"
              required
              autoComplete="name"
              value={values.contactPerson}
              error={errors.contactPerson}
              onChange={(event) => setField("contactPerson", event.target.value)}
            />
            <Input
              id={fieldId("email")}
              label="Sähköposti"
              type="email"
              required
              autoComplete="email"
              value={values.email}
              error={errors.email}
              onChange={(event) => setField("email", event.target.value)}
            />
            <Input
              id={fieldId("phone")}
              label="Puhelin"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => setField("phone", event.target.value)}
            />
            <Input
              id={fieldId("city")}
              label="Kaupunki"
              value={values.city}
              onChange={(event) => setField("city", event.target.value)}
            />
            <Select
              id={fieldId("status")}
              label="Tila"
              name="status"
              options={STATUS_OPTIONS}
              value={values.status}
              onValueChange={(value) => setField("status", value as CustomerStatus)}
            />
            <DialogFooter>
              <DialogClose>
                <Button type="button" variant="secondary" disabled={saving}>
                  Peruuta
                </Button>
              </DialogClose>
              <Button type="submit" loading={saving}>
                Tallenna
              </Button>
            </DialogFooter>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
