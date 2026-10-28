# Skeleton

Animated placeholder for content that is still loading. It keeps the layout stable and shows where content will appear.

```tsx
import { Skeleton } from "@/design-system/components";
```

## Props

| Prop | Values | Default |
|---|---|---|
| `variant` | `text`, `block` | `text` |
| `width` | `sm` (1/4), `md` (1/2), `lg` (3/4), `full` | `full` |
| `label` | Finnish loading message | none (hidden from assistive technology) |

## Examples

Table loading rows. Only the first Skeleton carries the label, so the state is announced once:

```tsx
<TableRow>
  <TableCell><Skeleton width="lg" label="Ladataan asiakkaita..." /></TableCell>
  <TableCell><Skeleton width="md" /></TableCell>
</TableRow>
<TableRow>
  <TableCell><Skeleton width="lg" /></TableCell>
  <TableCell><Skeleton width="md" /></TableCell>
</TableRow>
```

Form field placeholder:

```tsx
<Skeleton variant="block" label="Ladataan lomaketta..." />
```

## Do

- Mirror the shape of the real content: same number of columns, similar widths.
- Put a `label` on exactly one Skeleton per loading area.
- Replace the whole group at once when the data arrives.

## Don't

- Don't use it for actions that take a moment; use the `loading` prop of Button.
- Don't show it for more than a few seconds without an error or timeout path.
- Don't put a `label` on every placeholder; screen readers would repeat the message.
- Don't pass `className` or `style`.

## Accessibility

- Placeholders are `aria-hidden` unless they have a `label`. The labelled one becomes a polite `status` region with visually hidden text.
- The pulse animation is disabled with `prefers-reduced-motion`.
