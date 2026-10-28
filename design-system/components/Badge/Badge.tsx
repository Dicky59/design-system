import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import type { NativeProps } from "../../lib/styles";

const badgeStyles = cva(
  "inline-flex items-center whitespace-nowrap rounded-full border px-3 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "border-neutral-border bg-neutral-bg text-neutral-text",
        success: "border-success-border bg-success-bg text-success-text",
        warning: "border-warning-border bg-warning-bg text-warning-text",
        danger: "border-danger-border bg-danger-bg text-danger-text",
        info: "border-info-border bg-info-bg text-info-text",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps extends NativeProps<"span"> {
  /**
   * Meaning of the status. Pick by meaning, not by color.
   * @default "neutral"
   */
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  /**
   * Status text in Finnish, e.g. "Maksettu".
   * @a11y Required content: the status must always be readable as text, never conveyed by color alone.
   */
  children: string;
}

/**
 * Short status label, e.g. invoice state ("Maksettu", "Erääntynyt") or customer state ("Aktiivinen").
 * @a11y Always contains text. Tone only reinforces the meaning.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ tone, children, ...rest }, ref) {
  return (
    <span ref={ref} className={badgeStyles({ tone })} {...rest}>
      {children}
    </span>
  );
});
