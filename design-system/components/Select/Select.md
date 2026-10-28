# Select

Dropdown for choosing exactly one option from a short list, with built-in label, hint and error message.

```tsx
import { Select } from "@/design-system/components";
```

## Props

See `design-system/manifest.json` for the full list. Key props:

| Prop | Purpose |
|---|---|
| `label` (required) | Visible Finnish label |
| `options` (required) | `{ value, label, disabled? }[]`; `value` must not be `""` |
| `value` / `onValueChange` | Controlled usage |
| `defaultValue` | Uncontrolled usage |
| `placeholder` | Text when nothing is selected (default "Valitse") |
| `hint`, `error`, `required`, `disabled`, `name` | Same meaning as in Input |

## Examples

```tsx
<Select
  label="Maksuehto"
  name="paymentTerms"
  options={[
    { value: "14", label: "14 päivää netto" },
    { value: "30", label: "30 päivää netto" },
  ]}
  defaultValue="14"
/>
```

Controlled, with validation:

```tsx
<Select
  label="Asiakastyyppi"
  options={customerTypes}
  value={type}
  onValueChange={setType}
  required
  error={errors.type}
/>
```

## Do

- Use it for 3 to about 12 options. Fewer than 3: use radio buttons (not yet in the design system, add first). Many more: add a searchable combobox first.
- Keep option labels short, parallel and in sentence case.
- Give `required` fields a `placeholder` that prompts the action ("Valitse maksuehto").
- Use a stable `value` (id or code), never the display text.

## Don't

- Don't use `value=""` for an option such as "Ei valintaa"; it is not supported. Use `placeholder` for the empty state.
- Don't use Select for actions or navigation (use Button or a menu).
- Don't import `@radix-ui/react-select` in a view. Radix is internal to the design system.
- Don't use a native `<select>` next to this one; the two look and behave differently.
- Don't pass `className` or `style`.

## Accessibility

- Label is a real `<label for>`; hint and error are linked via `aria-describedby`; `error` sets `aria-invalid`.
- Keyboard: Enter, Space or arrow keys open the list; arrows move; typing jumps to a matching option; Esc closes and returns focus to the trigger.
- The selected option shows a check mark in addition to the highlight, so it is not color-only.
- The list opens above dialogs (`popover` z-index), so Select works inside Dialog.
