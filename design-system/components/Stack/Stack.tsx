import { cva } from "class-variance-authority";
import { forwardRef, type ReactNode } from "react";
import type { NativeProps } from "../../lib/styles";

const stackStyles = cva("flex", {
  variants: {
    direction: {
      column: "flex-col",
      row: "flex-row",
    },
    gap: {
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "6": "gap-6",
      "8": "gap-8",
    },
    align: {
      stretch: "items-stretch",
      start: "items-start",
      center: "items-center",
      end: "items-end",
    },
    switchAt: {
      none: "",
      sm: "sm:flex-row",
      md: "md:flex-row",
      lg: "lg:flex-row",
      xl: "xl:flex-row",
    },
    fill: {
      false: "",
      true: "",
    },
  },
  compoundVariants: [
    // `fill` shares the width equally, from the point where the stack becomes a row.
    { direction: "row", fill: true, class: "[&>*]:min-w-0 [&>*]:flex-1" },
    { direction: "column", switchAt: "sm", fill: true, class: "sm:[&>*]:min-w-0 sm:[&>*]:flex-1" },
    { direction: "column", switchAt: "md", fill: true, class: "md:[&>*]:min-w-0 md:[&>*]:flex-1" },
    { direction: "column", switchAt: "lg", fill: true, class: "lg:[&>*]:min-w-0 lg:[&>*]:flex-1" },
    { direction: "column", switchAt: "xl", fill: true, class: "xl:[&>*]:min-w-0 xl:[&>*]:flex-1" },
  ],
  defaultVariants: { direction: "column", gap: "4", align: "stretch", switchAt: "none", fill: false },
});

export interface StackProps extends NativeProps<"div"> {
  /**
   * Main axis. A `column` stack can become a row at `switchAt`.
   * @default "column"
   */
  direction?: "column" | "row";
  /**
   * Space between children, from the spacing tokens (1 = 0.25rem, 4 = 1rem).
   * @default "4"
   */
  gap?: "1" | "2" | "3" | "4" | "6" | "8";
  /**
   * Cross-axis alignment of the children.
   * @default "stretch"
   */
  align?: "stretch" | "start" | "center" | "end";
  /**
   * Breakpoint (token: sm 640, md 768, lg 1024, xl 1280) at which a `column` stack becomes a `row`. Mobile-first: below it the children are stacked. Ignored for `direction="row"`.
   * @default "none"
   */
  switchAt?: "none" | "sm" | "md" | "lg" | "xl";
  /**
   * Children share the row width equally (e.g. filter fields side by side). Has no effect while the stack is a column.
   * @default false
   */
  fill?: boolean;
  /** Content to lay out. */
  children: ReactNode;
}

/**
 * Lays out its children in a row or column with a token-based gap. The only way for views to arrange things
 * side by side or one above the other; it can switch from column to row at a breakpoint.
 * @a11y Layout only: it adds no semantics. Source order is visual order, so keep the DOM order meaningful.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { direction, gap, align, switchAt, fill, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={stackStyles({ direction, gap, align, switchAt, fill })} {...rest}>
      {children}
    </div>
  );
});
