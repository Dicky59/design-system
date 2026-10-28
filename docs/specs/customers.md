# Spec: Customers view ("Asiakkaat")

Status: draft

Route: `/customers`
Product context: a fictional Finnish B2B customer management and invoicing product. All data is made up.
Language: spec in English, **all UI text shown to end users in Finnish** (sentence case).

## 1. Goal
Let a finance or sales user find a customer quickly, see their status and open invoices at a glance, open a customer's details, and add a new customer.

## 2. Users and tasks
- Find a customer by name or business ID (Y-tunnus).
- Filter customers by status.
- Sort by name, open invoices amount, or last invoice date.
- Open a customer's details without leaving the page.
- Add a new customer.

## 3. Data model
```ts
type CustomerStatus = "active" | "new" | "overdue" | "inactive";

type Customer = {
  id: string;
  name: string;            // company name, fictional
  businessId: string;      // Y-tunnus format 1234567-8 (fictional)
  contactPerson: string;
  email: string;
  phone: string;           // Finnish format, e.g. +358 40 123 4567
  city: string;
  status: CustomerStatus;
  openInvoicesTotal: number; // EUR
  lastInvoiceDate: string | null; // ISO date
  invoices: { number: string; dueDate: string; amount: number; paid: boolean }[];
};
```
Mock data: 12 customers with fictional Finnish company names (no real brands), mixed statuses, at least one with no invoices, at least one overdue. Keep it in a separate data file, not inside components.

Status labels (Badge): `active` = "Aktiivinen" (success), `new` = "Uusi" (info), `overdue` = "Erääntynyt" (danger), `inactive` = "Ei aktiivinen" (neutral).

## 4. Layout (top to bottom)
1. Page heading (h1): "Asiakkaat", with a primary Button "Lisää asiakas" on the right.
2. Card containing filters: search Input (label "Hae asiakasta", hint "Nimi tai Y-tunnus") and status Select (label "Tila", options: "Kaikki", plus the four statuses).
3. Card containing the customer Table:
   - Required caption (visually accessible): "Asiakaslista".
   - Columns: Asiakas (name + Y-tunnus below), Yhteyshenkilö, Tila (Badge), Avoimet laskut (EUR, right-aligned), Viimeisin lasku (date). The customer name is a `link` Button that opens the details dialog; its accessible name is "Avaa tiedot: <name>" (there is no separate action column, so nothing is off-screen on small screens).
   - Sortable headers with `aria-sort`: Asiakas, Avoimet laskut, Viimeisin lasku.
   - Result count text under the table: "Näytetään 8 / 12 asiakasta".
4. Success Alert after adding a customer: "Asiakas lisätty." (dismissible, role status).

Responsive: on small screens the table scrolls horizontally inside its Card; filters stack vertically; heading and button wrap.

## 5. Customer details (Dialog)
- Title: customer name. Description: "Asiakkaan tiedot ja laskut".
- Tabs: "Perustiedot" and "Laskut".
  - Perustiedot: definition-list style rows: Y-tunnus, Yhteyshenkilö, Sähköposti, Puhelin, Kaupunki, Tila (Badge).
  - Laskut: small Table with caption "Asiakkaan laskut", columns Laskun numero, Eräpäivä, Summa, Tila (Badge "Maksettu" success / "Avoin" warning / "Erääntynyt" danger when due date is in the past and unpaid). Empty state: "Ei laskuja."
- Footer: Button "Sulje".

## 6. New customer (Dialog with form)
- Title: "Lisää asiakas". Description: "Täytä asiakkaan perustiedot."
- Fields (Input unless noted): Yrityksen nimi*, Y-tunnus* (pattern 1234567-8), Yhteyshenkilö*, Sähköposti* (email), Puhelin (tel), Kaupunki, Tila (Select, default "Uusi").
- Validation on submit, errors shown per field with the Input/Select error prop:
  - Required: "Tämä kenttä on pakollinen."
  - Y-tunnus: "Anna Y-tunnus muodossa 1234567-8."
  - Email: "Anna kelvollinen sähköpostiosoite."
- Buttons: primary "Tallenna", secondary "Peruuta". Tallenna shows loading state for ~600 ms (simulated), then closes the dialog, adds the customer to the table state, and shows the success Alert.
- Focus returns to the "Lisää asiakas" button after closing.

## 7. States
- Loading: table shows a skeleton or a "Ladataan asiakkaita..." row on first render (simulate ~500 ms).
- Empty (filters match nothing): table empty-state row "Ei hakua vastaavia asiakkaita." with a ghost Button "Tyhjennä suodattimet".
- Error: danger Alert "Asiakkaiden lataus epäonnistui." with a secondary Button "Yritä uudelleen" (provide a way to trigger this state in Storybook or via a query param `?state=error`).

## 8. Formatting
- Currency: `Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR" })`.
- Dates: `Intl.DateTimeFormat("fi-FI")` (e.g. 28.10.2026).
- Create small shared formatters in one utility file; do not format inline.

## 9. Components to use
Button, Input, Select, Badge, Card, Table, Tabs, Dialog, Alert. No new components in `app/`. If something is missing (e.g. skeleton, empty state, field group), add it to the design system first with a story and guide, and update the manifest.

## 10. Accessibility
- WCAG 2.2 AA. Keyboard-only usage works for every action.
- One h1; logical heading order. Table has caption and `th scope`.
- Status is never conveyed by color alone (Badge text always present).
- Dialogs trap focus, close with Esc, return focus to the trigger.
- Errors are associated with fields (`aria-describedby`, `aria-invalid`); focus moves to the first invalid field on failed submit.

## 11. Acceptance criteria
- [ ] View uses only design system components and tokens (lint passes, no arbitrary values).
- [ ] Search, status filter and sorting work together and update the result count.
- [ ] Details dialog and new customer dialog work as described, including validation and focus return.
- [ ] Loading, empty and error states all reachable and verified in the browser.
- [ ] All UI text is Finnish; code, comments and docs are English.
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` and `npm run build-storybook` pass; Storybook a11y shows no violations.
- [ ] Checked at mobile (375 px) and desktop (1280 px) widths.

## 12. Copy (Finnish)

| Where | Text |
|---|---|
| Page heading | Asiakkaat |
| Primary action | Lisää asiakas |
| Search label / hint | Hae asiakasta / Nimi tai Y-tunnus |
| Status filter | Tila: Kaikki, Aktiivinen, Uusi, Erääntynyt, Ei aktiivinen |
| Table caption | Asiakaslista |
| Customer name button (accessible name) | Avaa tiedot: <nimi> |
| Result count | Näytetään 8 / 12 asiakasta |
| Empty | Ei hakua vastaavia asiakkaita. / Tyhjennä suodattimet |
| Loading | Ladataan asiakkaita... |
| Error | Asiakkaiden lataus epäonnistui. / Yritä uudelleen |
| Success | Asiakas lisätty. |
| Details dialog | Asiakkaan tiedot ja laskut; Perustiedot, Laskut; Sulje |
| Invoices | Asiakkaan laskut; Maksettu, Avoin, Erääntynyt; Ei laskuja. |
| New customer dialog | Lisää asiakas; Täytä asiakkaan perustiedot.; Tallenna, Peruuta |
| Validation | Tämä kenttä on pakollinen.; Anna Y-tunnus muodossa 1234567-8.; Anna kelvollinen sähköpostiosoite. |

## 13. Out of scope
- Real backend or persistence; added customers live in component state only.
- Editing or deleting customers, creating invoices.
- Pagination and server-side search.
- Locales other than Finnish.
