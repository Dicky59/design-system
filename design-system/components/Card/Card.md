# Card

Bordered surface that groups related content, such as one customer's details or a summary block.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/design-system/components";
```

## Parts

| Part | Purpose |
|---|---|
| `Card` | Container |
| `CardHeader` | Top row; title on the left, optional Badge or Button on the right |
| `CardTitle` | Heading. Requires `level` (`2`, `3` or `4`) |
| `CardContent` | Body |
| `CardFooter` | Actions, right-aligned |

All parts are optional except `Card`. Props are in `design-system/manifest.json`.

## Examples

```tsx
<Card>
  <CardHeader>
    <CardTitle level={2}>Pohjoinen Kone Oy</CardTitle>
    <Badge tone="success">Aktiivinen</Badge>
  </CardHeader>
  <CardContent>
    <p>Y-tunnus 1234567-8</p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary">Muokkaa</Button>
    <Button>Luo lasku</Button>
  </CardFooter>
</Card>
```

Card in a responsive grid (layout is done by the parent, not the Card):

```tsx
<div className="grid gap-6 md:grid-cols-2">
  <Card>...</Card>
  <Card>...</Card>
</div>
```

## Do

- Choose `CardTitle level` so the page outline stays correct (h1 for the page, h2 for top-level cards, h3 inside those).
- Put the primary action last in `CardFooter`.
- Lay out cards with grid or flex in the parent container.

## Don't

- Don't nest a Card inside another Card.
- Don't make the whole Card clickable. Put a Button or link inside it.
- Don't use a Card to wrap a table that already has its own heading; use the Table directly in the page section.
- Don't use a Card as a status message; use Alert.
- Don't use a heading element for styling. `CardTitle` is the only styled heading in a Card.
- Don't pass `className` or `style`.

## Accessibility

- `CardTitle` renders a real `h2`-`h4`, so cards are navigable by heading.
- A Card has no landmark role. If it is a major page region, wrap it in a `section` with `aria-labelledby`, or put a landmark in the view.
