# DescriptionList

Read-only list of labelled values: a term (label) and its definition (value). Use it for details such as a customer's basic information.

```tsx
import { DescriptionList, DescriptionItem } from "@/design-system/components";
```

## Props

| Part | Prop | Notes |
|---|---|---|
| `DescriptionList` | `children` | `DescriptionItem` elements |
| `DescriptionItem` | `term` | Finnish label (required) |
| `DescriptionItem` | `children` | The value: text or a `Badge` |

## Examples

```tsx
<DescriptionList>
  <DescriptionItem term="Y-tunnus">1234567-8</DescriptionItem>
  <DescriptionItem term="Tila"><Badge tone="success">Aktiivinen</Badge></DescriptionItem>
</DescriptionList>
```

## Do

- Use for key/value details that the user only reads.
- Keep terms short, sentence case, without a trailing colon.
- Use `Badge` for statuses so they carry text.

## Don't

- Don't use it for editable values; use `Input`.
- Don't use it for tabular data with many rows and columns; use `Table`.
- Don't build the same thing with `div`s or a `Table`.
- Don't pass `className` or `style`.

## Accessibility

- Native `dl`/`dt`/`dd` inside `div` groups, which is valid HTML and read as term/value pairs.
- Items stack on narrow screens and sit side by side from `sm`.
