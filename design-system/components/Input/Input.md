# Input

Single-line text field with built-in label, hint and error message. Use it for every text-like form field.

```tsx
import { Input } from "@/design-system/components";
```

## Props

See `design-system/manifest.json` for the full list. Key props:

| Prop | Purpose |
|---|---|
| `label` (required) | Visible Finnish label |
| `hint` | Helper text, e.g. expected format |
| `error` | Error message; marks the field invalid |
| `required` | Native `required` plus an asterisk |
| `type` | `text`, `email`, `tel`, `search`, `number`, `password`, `url` |

All other native `<input>` attributes (`name`, `value`, `onChange`, `autoComplete`, `disabled`, ...) pass through. `className` and `style` are not accepted.

## Examples

```tsx
<Input label="Yrityksen nimi" name="company" required />
```

With format hint and validation error:

```tsx
<Input
  label="Y-tunnus"
  name="businessId"
  hint="Muoto 1234567-8"
  error={errors.businessId}
  value={values.businessId}
  onChange={(e) => setValue("businessId", e.target.value)}
/>
```

Autofill-friendly contact fields:

```tsx
<Input label="Sähköposti" type="email" autoComplete="email" name="email" />
```

## Do

- Always provide `label`. Keep it short and in sentence case: "Laskutusosoite".
- Use `hint` for format and constraints; use `error` for what went wrong and how to fix it.
- Set `autoComplete` on personal and contact fields.
- Use the right `type` so mobile keyboards and validation help the user.
- Explain the asterisk once per form: "* = pakollinen kenttä".

## Don't

- Don't use `placeholder` as the label or as the only place for the format. Placeholders vanish and have low contrast.
- Don't render your own `<label>` or `<input>` in a view.
- Don't show errors only as a red border; `error` renders text with an icon for that reason.
- Don't write vague errors ("Virheellinen"). Say what is expected.
- Don't pass `className` or `style` to adjust width; lay it out with a parent grid or flex container.
- Don't use `type="number"` for identifiers like Y-tunnus or phone numbers; use `text` or `tel`.

## Accessibility

- The label is a real `<label for>`; hint and error are linked via `aria-describedby`.
- An `error` sets `aria-invalid="true"`.
- The border of an input meets the 3:1 non-text contrast requirement (`border-strong`).
- Focus ring is visible on keyboard focus.
