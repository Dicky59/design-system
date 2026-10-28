# Alert

Inline message about the state of the page or the result of a task: confirmation, warning, error, or neutral information.

```tsx
import { Alert } from "@/design-system/components";
```

## Props

| Prop | Values | Default |
|---|---|---|
| `tone` | `info`, `success`, `warning`, `danger` | `info` |
| `title` | short bold summary | none |
| `onDismiss` | callback; shows a close button | none |
| `dismissLabel` | accessible name of the close button | "Sulje ilmoitus" |
| `children` | message text (required) | |

Full props: `design-system/manifest.json`.

## Tone meaning

| Tone | Use for | Announced as |
|---|---|---|
| `info` | Neutral information, tips | `status` (polite) |
| `success` | A task completed | `status` (polite) |
| `warning` | Something needs attention soon | `alert` (assertive) |
| `danger` | An error or failure | `alert` (assertive) |

## Examples

```tsx
<Alert tone="success" title="Lasku lähetetty">
  Lasku 2026-0142 lähetettiin verkkolaskuna.
</Alert>
```

Error with next step, shown above a form:

```tsx
<Alert tone="danger" title="Tallennus epäonnistui">
  Tarkista Y-tunnus ja yritä uudelleen.
</Alert>
```

Dismissible:

```tsx
{visible && <Alert onDismiss={() => setVisible(false)}>Voit tuoda asiakkaat CSV-tiedostosta.</Alert>}
```

## Do

- Say what happened and what to do next, in one or two sentences.
- Place the alert near what it concerns: above the form for save errors, above the table for list-wide notices.
- Mount the Alert when the state occurs instead of hiding it with CSS, so screen readers announce it.
- Use `title` when the message needs a headline; skip it for one-liners.

## Don't

- Don't use `danger` for field-level validation. Use the `error` prop of Input or Select.
- Don't stack several alerts of the same tone; merge them.
- Don't use Alert for questions that need an answer; use Dialog.
- Don't auto-dismiss alerts on a timer. Users may not have finished reading.
- Don't use color to carry the meaning in custom text; the icon and text already do.
- Don't pass `className`, `style` or `role`; the role is set from the tone.

## Accessibility

- `warning` and `danger` use `role="alert"`; `info` and `success` use `role="status"`.
- Every tone has an icon and text, so the message does not rely on color.
- The dismiss button has an accessible name (Finnish, configurable) and a visible focus ring.
- Text/background pairs meet 4.5:1 contrast.
