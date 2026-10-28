# Button

Triggers an action (save, send, delete). For navigation to another page use a link, not a Button.

```tsx
import { Button, IconButton } from "@/design-system/components";
```

## Props

See `design-system/manifest.json` for the full list. Key props:

| Prop | Values | Default |
|---|---|---|
| `variant` | `primary`, `secondary`, `ghost`, `danger` | `primary` |
| `size` | `sm`, `md`, `lg` | `md` |
| `loading` | `boolean` | `false` |
| `type` | native button type | `button` |

`IconButton` has the same `variant`/`size`/`loading` and requires `aria-label` (Finnish) and `icon`.

## Examples

Primary action with a secondary alternative:

```tsx
<div className="flex gap-3">
  <Button onClick={save}>Tallenna asiakas</Button>
  <Button variant="secondary" onClick={cancel}>Peruuta</Button>
</div>
```

Submit button that shows progress:

```tsx
<Button type="submit" loading={isSaving}>
  {isSaving ? "Tallennetaan" : "Tallenna"}
</Button>
```

Icon-only control:

```tsx
<IconButton aria-label="Poista rivi" variant="ghost" icon={<IconX />} onClick={removeRow} />
```

## Do

- Use one `primary` button per view area. The rest are `secondary` or `ghost`.
- Write labels as verb + object in sentence case: "Lisää asiakas", "Lähetä lasku".
- Use `danger` only for destructive actions, and confirm them in a Dialog.
- Set `type="submit"` explicitly on form submit buttons (the default is `button`).

## Don't

- Don't pass `className` or `style`; they are not accepted. Add a variant to the component if you need a new look.
- Don't use an icon-only control without `IconButton` and its `aria-label`.
- Don't put several `primary` buttons side by side.
- Don't use `loading` and also swap the label to something unrelated; keep it recognizable ("Tallennetaan").
- Don't use a Button for page navigation.
- Don't use color alone to communicate danger; the label must say what happens ("Poista asiakas", not "OK").

## Accessibility

- Visible focus ring comes from the `focus` token. Never remove it.
- `loading` sets `aria-busy` and disables the button, so it cannot be double-submitted.
- Disabled buttons are not focusable; if the reason matters, explain it in nearby text rather than only disabling.
- Minimum height is 32 px (`sm`), above the WCAG 2.2 minimum target size of 24 px. Prefer `md` for touch.
