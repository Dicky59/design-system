# Table

Data table for lists of records (customers, invoices). Semantic HTML table with sortable headings and an empty state.

```tsx
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty,
} from "@/design-system/components";
```

## Parts

| Part | Renders | Notes |
|---|---|---|
| `Table` | `table` in a scroll region | `caption` is required; `captionHidden` hides it visually; `variant` is `bordered` (default) or `flush` |
| `TableHeader` | `thead` | One `TableRow` of `TableHead` |
| `TableBody` | `tbody` | `TableRow`s, or one `TableEmpty` |
| `TableRow` | `tr` | |
| `TableHead` | `th scope="col"` | `numeric`, `sortDirection`, `onSort` |
| `TableCell` | `td` or `th scope="row"` | `numeric`, `rowHeader` |
| `TableEmpty` | row with one cell | `colSpan` = number of columns |

Full props: `design-system/manifest.json`.

## Examples

```tsx
<Table caption="Asiakkaat">
  <TableHeader>
    <TableRow>
      <TableHead>Asiakas</TableHead>
      <TableHead>Tila</TableHead>
      <TableHead numeric>Avoin saldo</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {customers.length === 0 ? (
      <TableEmpty colSpan={3}>Ei asiakkaita. Lisää ensimmäinen asiakas.</TableEmpty>
    ) : (
      customers.map((c) => (
        <TableRow key={c.id}>
          <TableCell rowHeader>{c.name}</TableCell>
          <TableCell><Badge tone="success">Aktiivinen</Badge></TableCell>
          <TableCell numeric>{euro.format(c.balance)}</TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
```

Sortable column (the view owns the sorting state):

```tsx
<TableHead sortDirection={sort.dir} onSort={() => toggleSort("name")}>Asiakas</TableHead>
```

## Variants

- `bordered` (default): the table draws its own border and rounded corners. Use it on the page background or in a Dialog.
- `flush`: no border or rounding. Use it inside a `Card`, which already has a border, to avoid a double border.

```tsx
<Card>
  <CardContent>
    <Table caption="Asiakaslista" variant="flush">...</Table>
  </CardContent>
</Card>
```

## Do

- Always give a `caption`. Use `captionHidden` when a heading right above already shows the same text.
- Mark amounts, counts and dates `numeric` in both `TableHead` and `TableCell`, and format them with `Intl` (`fi-FI`).
- Make the first column a `rowHeader` when it identifies the row (customer name).
- Pass `sortDirection` only on the column currently sorted; give other sortable columns `sortDirection="none"` along with `onSort`.
- Show `TableEmpty` with a next step instead of an empty body.

## Don't

- Don't put a `bordered` Table inside a Card; use `flush`.
- Don't build tables from `div`s or raw `<table>` in a view.
- Don't put interactive controls in every cell without labels. Name them with context ("Muokkaa asiakasta Pohjoinen Kone Oy").
- Don't convey status by color alone; use Badge with text.
- Don't use a table for layout.
- Don't rely on horizontal scroll for important data on phones; prefer fewer columns.
- Don't pass `className` or `style`.

## Accessibility

- The scroll wrapper has `role="region"`, `tabindex="0"` and an `aria-label` built from the caption: "<caption>, vieritettävä" (for example "Asiakaslista, vieritettävä"). Screen reader users hear that the area scrolls, and keyboard users can focus it and scroll with the arrow keys. The label is generated; don't add your own.
- Column headings use `scope="col"`; sortable headings are real buttons and set `aria-sort` plus an arrow icon.
- Row hover is decorative; nothing is conveyed by it alone.
