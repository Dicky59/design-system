import * as RadixDialog from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { forwardRef, type ReactElement, type ReactNode } from "react";
import { IconX } from "../../lib/icons";
import { focusRing } from "../../lib/styles";

export interface DialogProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the dialog requests to open or close (Esc, overlay click, close button). */
  onOpenChange?: (open: boolean) => void;
  /** DialogTrigger (optional) and DialogContent. */
  children: ReactNode;
}

/**
 * Modal window for a focused task or a confirmation. Compose with DialogTrigger, DialogContent,
 * DialogFooter and DialogClose.
 * @a11y Focus moves into the dialog, is trapped there, returns to the trigger on close; Esc closes.
 */
export function Dialog({ open, defaultOpen, onOpenChange, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  );
}

export interface DialogTriggerProps {
  /** A single interactive element, usually a Button. It receives the open behavior. */
  children: ReactElement;
}

/** Wraps the element that opens the dialog. */
export function DialogTrigger({ children }: DialogTriggerProps) {
  return <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>;
}

const contentStyles = cva(
  "fixed left-1/2 top-1/2 z-modal max-h-screen w-full -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-surface p-6 text-content shadow-lg",
  {
    variants: {
      size: { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" },
    },
    defaultVariants: { size: "md" },
  },
);

export interface DialogContentProps {
  /**
   * Dialog title in Finnish. Names the dialog for screen readers.
   * @a11y Required.
   */
  title: string;
  /**
   * One or two sentences explaining the purpose or consequence.
   * @a11y Required: announced when the dialog opens.
   */
  description: string;
  /**
   * Width of the dialog.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Accessible name of the close button.
   * @default "Sulje"
   */
  closeLabel?: string;
  /** Body content, and a DialogFooter with the actions. */
  children?: ReactNode;
}

/** The dialog window with overlay, title, description and a close button. */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { title, description, size, closeLabel = "Sulje", children },
  ref,
) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-overlay bg-overlay" />
      <RadixDialog.Content ref={ref} className={contentStyles({ size })}>
        <div className="flex flex-col gap-1.5 pr-8">
          <RadixDialog.Title className="text-xl font-semibold text-content">{title}</RadixDialog.Title>
          <RadixDialog.Description className="text-sm text-content-muted">{description}</RadixDialog.Description>
        </div>
        <RadixDialog.Close
          aria-label={closeLabel}
          className={`absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-content-muted hover:bg-surface-sunken hover:text-content ${focusRing}`}
        >
          <IconX />
        </RadixDialog.Close>
        {children ? <div className="mt-4 flex flex-col gap-4">{children}</div> : null}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
});

export interface DialogFooterProps {
  /** Action buttons. Put the primary action last. */
  children: ReactNode;
}

/** Right-aligned action row at the bottom of the dialog. */
export function DialogFooter({ children }: DialogFooterProps) {
  return <div className="mt-2 flex items-center justify-end gap-3">{children}</div>;
}

export interface DialogCloseProps {
  /** A single interactive element, usually a secondary Button ("Peruuta"). It closes the dialog. */
  children: ReactElement;
}

/** Wraps an element that closes the dialog when activated. */
export function DialogClose({ children }: DialogCloseProps) {
  return <RadixDialog.Close asChild>{children}</RadixDialog.Close>;
}
