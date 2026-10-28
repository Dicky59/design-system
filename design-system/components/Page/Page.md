# Page

The page container: the single `main` landmark with responsive padding, a centered maximum width and a gap between sections.

```tsx
import { Page, PageHeader } from "@/design-system/components";
```

## Props

| Prop | Values |
|---|---|
| `children` | a `PageHeader` followed by the page's sections |

## Examples

```tsx
<Page>
  <PageHeader title="Asiakkaat">
    <Button>Lisää asiakas</Button>
  </PageHeader>
  <Card>...</Card>
  <Card>...</Card>
</Page>
```

## Do

- Use exactly one `Page` per route, as the root of the view.
- Make each section a `Card` with a `CardTitle` (level 2), so the outline continues from the `h1`.

## Don't

- Don't write `<main>` by hand in `app/`.
- Don't nest a `Page` inside another.
- Don't pass `className` or `style`; spacing between sections is built in.

## Accessibility

- Provides the `main` landmark. Padding is 16 px on mobile and 24 px from `md`; content is never wider than the viewport.
