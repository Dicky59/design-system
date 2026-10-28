# Stack

Layout primitive that arranges children in a column or a row with a token gap. It can switch from column to row at a breakpoint, so a mobile-first layout needs no custom classes.

```tsx
import { Stack } from "@/design-system/components";
```

## Props

| Prop | Values | Default |
|---|---|---|
| `direction` | `column`, `row` | `column` |
| `gap` | `1`, `2`, `3`, `4`, `6`, `8` (spacing tokens) | `4` |
| `align` | `stretch`, `start`, `center`, `end` | `stretch` |
| `switchAt` | `none`, `sm`, `md`, `lg`, `xl` (token breakpoints) | `none` |
| `fill` | boolean, children share the row width equally | `false` |

## Examples

Form fields:

```tsx
<Stack gap="3">
  <Input label="Yrityksen nimi" required />
  <Input label="Y-tunnus" required />
</Stack>
```

Filters stacked on mobile, side by side from `md`:

```tsx
<Stack switchAt="md" fill>
  <Input label="Hae asiakasta" type="search" />
  <Select label="Tila" options={statusOptions} />
</Stack>
```

Action row:

```tsx
<Stack direction="row" gap="2" align="center">
  <Button variant="secondary">Peruuta</Button>
  <Button>Tallenna</Button>
</Stack>
```

## Do

- Use it for every arrangement of components in a view: forms, filter rows, button groups.
- Pick `gap` by relationship: `2` between related controls, `3`/`4` between fields, `6`/`8` between sections.
- Use `switchAt` instead of writing responsive classes. Below the breakpoint children are stacked (mobile-first).
- Nest Stacks for two-dimensional layouts.
- Use `fill` for rows of form fields (filters, address parts) that should share the width equally; combine with `switchAt` so they stack on mobile.

## Don't

- Don't pass `className` or `style`; there is no escape hatch. If a layout is missing, add a prop or a component.
- Don't use it for page structure (use `Page`) or for tabular data (use `Table`).
- Don't reorder content visually; the DOM order is the reading and tab order.
- Don't use `fill` with children that must keep their own width, such as buttons.
- Don't hand-write `flex`, `grid` or `gap-*` in `app/`.

## Accessibility

- A plain `div` with no role. It adds no semantics, so choose sensible source order.
- Responsive behavior uses the token breakpoints, and the layout reflows without horizontal scrolling at 320 px.
