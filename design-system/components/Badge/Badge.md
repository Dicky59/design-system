# Badge

Short, non-interactive status label. Typical uses: invoice status, customer status, counts of state.

```tsx
import { Badge } from "@/design-system/components";
```

## Props

| Prop | Values | Default |
|---|---|---|
| `tone` | `neutral`, `success`, `warning`, `danger`, `info` | `neutral` |
| `children` | status text (string, required) | |

## Tone meaning

| Tone | Use for | Example |
|---|---|---|
| `neutral` | No judgement, inactive, draft | Luonnos, Passiivinen |
| `success` | Done, healthy | Maksettu, Aktiivinen |
| `warning` | Needs attention soon | Odottaa maksua |
| `danger` | Problem, overdue | Erääntynyt |
| `info` | Informational progress | Lähetetty |

## Examples

```tsx
<Badge tone="success">Maksettu</Badge>
```

Mapping a domain status to a tone in one place:

```tsx
const invoiceTone = {
  draft: "neutral",
  sent: "info",
  paid: "success",
  overdue: "danger",
} as const;

<Badge tone={invoiceTone[invoice.status]}>{invoiceStatusLabel[invoice.status]}</Badge>
```

## Do

- Keep text to one or two words, sentence case.
- Map status to tone through a single lookup, so the same status always looks the same.
- Use in table cells and card headers next to the thing it describes.

## Don't

- Don't use a Badge as a button or link; it is not interactive.
- Don't rely on color: the text must carry the meaning. Never render an empty Badge or only a number without context.
- Don't invent tones by picking colors; choose the tone by meaning.
- Don't use `danger` for decoration. Too many red badges make nothing stand out.
- Don't put long sentences in it. Use an Alert for messages.
- Don't pass `className` or `style`.

## Accessibility

- It is plain text in a `span`, so screen readers read it in context. Make sure the surrounding text identifies what the status refers to (e.g. in a table column headed "Tila").
- All tone pairs meet 4.5:1 contrast.
