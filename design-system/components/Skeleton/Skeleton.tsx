import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import type { NativeProps } from "../../lib/styles";

const skeletonStyles = cva("block animate-pulse rounded-md bg-surface-sunken motion-reduce:animate-none", {
  variants: {
    variant: {
      text: "h-4",
      block: "h-10",
    },
    width: {
      sm: "w-1/4",
      md: "w-1/2",
      lg: "w-3/4",
      full: "w-full",
    },
  },
  defaultVariants: { variant: "text", width: "full" },
});

export interface SkeletonProps extends Omit<NativeProps<"span">, "children" | "role" | "aria-hidden"> {
  /**
   * Shape of the placeholder: one line of text or a taller block (input, button, card).
   * @default "text"
   */
  variant?: "text" | "block";
  /**
   * Width relative to the container.
   * @default "full"
   */
  width?: "sm" | "md" | "lg" | "full";
  /**
   * Finnish loading message, e.g. "Ladataan asiakkaita...". Announced politely to screen readers.
   * @a11y Set on exactly one Skeleton per loading area. Without it the placeholder is hidden from assistive technology.
   */
  label?: string;
}

/**
 * Animated placeholder shown while content loads. Mirrors the layout of the content that will replace it.
 * @a11y Placeholders are decorative. Give one Skeleton per loading area a `label` so the loading state is announced.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant, width, label, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : true}
      className={skeletonStyles({ variant, width })}
      {...rest}
    >
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
});
