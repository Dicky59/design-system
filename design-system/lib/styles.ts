import type { ComponentPropsWithoutRef, ElementType } from "react";

/** Visible keyboard focus shared by all interactive components (uses the `focus` token). */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

/** Native element props without `className` and `style`: styling goes through variants only. */
export type NativeProps<T extends ElementType> = Omit<ComponentPropsWithoutRef<T>, "className" | "style">;
