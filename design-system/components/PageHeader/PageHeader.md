# PageHeader

Top of a page: the `h1` title with an optional page-level action on the right.

```tsx
import { PageHeader, Button } from "@/design-system/components";
```

## Props

| Prop | Values | Default |
|---|---|---|
| `title` | Finnish page title (required) | |
| `children` | page actions, usually one primary `Button` | none |

## Examples

```tsx
<PageHeader title="Asiakkaat">
  <Button>Lisää asiakas</Button>
</PageHeader>
```

## Do

- Use exactly one per page, as the first thing inside `Page`.
- Keep the title a short noun ("Asiakkaat", "Laskut").
- Put at most one `primary` Button in it.

## Don't

- Don't write `<h1>` by hand in `app/`.
- Don't use it for section headings inside the page; use `CardTitle` with the right level.
- Don't put filters or long content inside it.
- Don't pass `className` or `style`.

## Accessibility

- Renders the page's `h1`; headings below it must continue at `h2` without skipping levels.
- The actions wrap below the title on narrow screens, so nothing overflows at 375 px.
