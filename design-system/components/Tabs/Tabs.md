# Tabs

Switches between related panels of content on one page, for example a customer's details, invoices and contacts.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/design-system/components";
```

## Parts

| Part | Notes |
|---|---|
| `Tabs` | Root. `defaultValue` (uncontrolled) or `value` + `onValueChange` (controlled) |
| `TabsList` | `label` is required (names the tab group) |
| `TabsTrigger` | `value` links it to a `TabsContent`; optional `disabled` |
| `TabsContent` | `value` must match a trigger |

Full props: `design-system/manifest.json`.

## Example

```tsx
<Tabs defaultValue="tiedot">
  <TabsList label="Asiakkaan tiedot">
    <TabsTrigger value="tiedot">Perustiedot</TabsTrigger>
    <TabsTrigger value="laskut">Laskut</TabsTrigger>
  </TabsList>
  <TabsContent value="tiedot">...</TabsContent>
  <TabsContent value="laskut">...</TabsContent>
</Tabs>
```

Controlled, e.g. to sync with the URL:

```tsx
<Tabs value={tab} onValueChange={setTab}>...</Tabs>
```

## Do

- Use 2 to 6 tabs with short, noun-based Finnish titles ("Laskut", "Yhteyshenkilöt").
- Keep the content of all tabs about the same subject (one customer).
- Give `TabsList` a `label` that says what is being switched.
- Make sure every `TabsTrigger` has a `TabsContent` with the same `value`.

## Don't

- Don't use Tabs for navigation between pages or routes; use links in a `nav`.
- Don't use Tabs for steps in a process; they are not ordered or sequential.
- Don't put critical, must-see content (like an error) only inside a hidden tab.
- Don't nest Tabs inside Tabs.
- Don't change the view or submit a form when a tab is selected.
- Don't pass `className` or `style`.

## Accessibility

- Radix implements the WAI-ARIA tabs pattern: `tablist`, `tab`, `tabpanel`, roving tabindex.
- Keyboard: arrow keys switch tabs, Home/End jump to the first/last tab, Tab moves into the active panel.
- The active tab has an underline and darker text, so it is not indicated by color only.
