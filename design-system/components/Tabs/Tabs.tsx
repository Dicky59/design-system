import * as RadixTabs from "@radix-ui/react-tabs";
import { forwardRef, type ReactNode } from "react";
import { focusRing } from "../../lib/styles";

export interface TabsProps {
  /** Controlled active tab (the `value` of a TabsTrigger). */
  value?: string;
  /** Initially active tab when uncontrolled. */
  defaultValue?: string;
  /** Called with the `value` of the newly active tab. */
  onValueChange?: (value: string) => void;
  /** TabsList and one TabsContent per tab. */
  children: ReactNode;
}

/**
 * Switches between related panels of content on the same page. Compose with TabsList,
 * TabsTrigger and TabsContent.
 * @a11y Keyboard: arrow keys move between tabs, Home/End jump to first/last, Tab moves into the panel.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value, defaultValue, onValueChange, children },
  ref,
) {
  return (
    <RadixTabs.Root ref={ref} value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
      {children}
    </RadixTabs.Root>
  );
});

export interface TabsListProps {
  /**
   * Accessible name of the tab group in Finnish, e.g. "Asiakkaan tiedot".
   * @a11y Required: names the tablist for screen readers.
   */
  label: string;
  /** TabsTrigger elements. */
  children: ReactNode;
}

/** Row of tab buttons. */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList({ label, children }, ref) {
  return (
    <RadixTabs.List ref={ref} aria-label={label} className="flex gap-1 border-b border-border">
      {children}
    </RadixTabs.List>
  );
});

export interface TabsTriggerProps {
  /** Identifies the tab; must match the `value` of its TabsContent. */
  value: string;
  disabled?: boolean;
  /** Short Finnish tab title. */
  children: ReactNode;
}

/** A single tab button. */
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, disabled, children },
  ref,
) {
  return (
    <RadixTabs.Trigger
      ref={ref}
      value={value}
      disabled={disabled}
      className={`-mb-px rounded-t-md border-b-2 border-transparent px-4 py-2 text-sm font-medium text-content-muted hover:text-content disabled:cursor-not-allowed disabled:text-content-disabled data-active:border-primary data-active:text-content ${focusRing}`}
    >
      {children}
    </RadixTabs.Trigger>
  );
});

export interface TabsContentProps {
  /** Matches the `value` of its TabsTrigger. */
  value: string;
  children: ReactNode;
}

/** Panel shown when its tab is active. */
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { value, children },
  ref,
) {
  return (
    <RadixTabs.Content ref={ref} value={value} className={`pt-6 ${focusRing} rounded-md`}>
      {children}
    </RadixTabs.Content>
  );
});
