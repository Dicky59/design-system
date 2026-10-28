# Dialog

Modal window for a short, focused task (a small form) or a confirmation (especially destructive actions).

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose } from "@/design-system/components";
```

## Parts

| Part | Notes |
|---|---|
| `Dialog` | Root. Uncontrolled, or `open` + `onOpenChange` |
| `DialogTrigger` | Wraps one element (a `Button`) that opens the dialog |
| `DialogContent` | `title` and `description` are required; `size` `sm`/`md`/`lg`; `closeLabel` defaults to "Sulje" |
| `DialogFooter` | Right-aligned actions, primary last |
| `DialogClose` | Wraps one element (a `Button`) that closes the dialog |

Full props: `design-system/manifest.json`.

## Examples

Destructive confirmation:

```tsx
<Dialog>
  <DialogTrigger>
    <Button variant="danger">Poista asiakas</Button>
  </DialogTrigger>
  <DialogContent
    size="sm"
    title="Poistetaanko asiakas?"
    description="Asiakas ja sen laskuhistoria poistetaan pysyvästi."
  >
    <DialogFooter>
      <DialogClose><Button variant="secondary">Peruuta</Button></DialogClose>
      <Button variant="danger" onClick={deleteCustomer}>Poista asiakas</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Controlled, e.g. close after a successful save:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent title="Lisää asiakas" description="...">
    <form onSubmit={...}>...</form>
  </DialogContent>
</Dialog>
```

## Do

- Phrase the title as the action or question: "Poistetaanko asiakas?", "Lisää asiakas".
- Use the description to state the consequence, especially for irreversible actions.
- Label the confirm button with the specific action ("Poista asiakas"), not "OK" or "Kyllä".
- Keep the dialog short. If it needs scrolling or several steps, use a page.
- Provide a clear way out: a "Peruuta" button via `DialogClose`.

## Don't

- Don't open a dialog from a dialog.
- Don't use a Dialog for non-blocking messages; use Alert.
- Don't omit `title` or `description`; they are required because screen readers announce them.
- Don't import `@radix-ui/react-dialog` in a view. Radix is internal.
- Don't build a custom overlay or modal in a view.
- Don't pass `className` or `style`.

## Accessibility

- Rendered with `role="dialog"` and `aria-modal`; title and description are linked via `aria-labelledby` and `aria-describedby`.
- Focus moves into the dialog on open, is trapped inside, and returns to the trigger on close.
- Esc and the close button (labelled "Sulje" by default) close it; clicking the overlay also closes it.
- The page behind is hidden from assistive technology while the dialog is open.
- Selects opened inside a dialog render above it.
