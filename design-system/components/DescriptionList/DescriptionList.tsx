import { forwardRef, type ReactNode } from "react";
import type { NativeProps } from "../../lib/styles";

export interface DescriptionListProps extends NativeProps<"dl"> {
  /** DescriptionItem elements. */
  children: ReactNode;
}

/**
 * Read-only list of labelled values (term and definition), e.g. the basic details of a customer.
 * Compose with DescriptionItem.
 * @a11y Rendered as a native `dl`, so screen readers announce each term with its value.
 */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList(
  { children, ...rest },
  ref,
) {
  return (
    <dl ref={ref} className="divide-y divide-border text-sm" {...rest}>
      {children}
    </dl>
  );
});

export interface DescriptionItemProps extends NativeProps<"div"> {
  /** Label in Finnish, e.g. "Y-tunnus". */
  term: string;
  /** The value. Plain text, or a Badge for a status. */
  children: ReactNode;
}

/** One term and its value inside a DescriptionList. Stacked on narrow screens, side by side from `sm`. */
export const DescriptionItem = forwardRef<HTMLDivElement, DescriptionItemProps>(function DescriptionItem(
  { term, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4" {...rest}>
      <dt className="font-medium text-content-muted sm:w-1/3">{term}</dt>
      <dd className="text-content sm:w-2/3">{children}</dd>
    </div>
  );
});
