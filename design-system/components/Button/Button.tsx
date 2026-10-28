import { cva } from "class-variance-authority";
import { forwardRef, type ReactNode } from "react";
import { IconSpinner } from "../../lib/icons";
import { focusRing, type NativeProps } from "../../lib/styles";

const buttonStyles = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-surface-sunken disabled:text-content-disabled",
    focusRing,
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-text hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "border border-border-strong bg-surface text-content hover:bg-surface-muted active:bg-surface-sunken",
        ghost: "bg-transparent text-primary-subtle-text hover:bg-primary-subtle active:bg-primary-subtle-hover",
        danger: "bg-danger-solid text-danger-solid-text hover:bg-danger-solid-hover active:bg-danger-solid-active",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
      iconOnly: {
        true: "px-0",
        false: "",
      },
    },
    compoundVariants: [
      { iconOnly: true, size: "sm", class: "w-8" },
      { iconOnly: true, size: "md", class: "w-10" },
      { iconOnly: true, size: "lg", class: "w-12" },
    ],
    defaultVariants: { variant: "primary", size: "md", iconOnly: false },
  },
);

interface ButtonBaseProps {
  /**
   * Visual emphasis. Use one `primary` per view area; `danger` for destructive actions.
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /**
   * Control height.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** Shows a spinner and disables the button while an action runs. Sets `aria-busy`. */
  loading?: boolean;
}

export interface ButtonProps extends ButtonBaseProps, NativeProps<"button"> {
  /** Visible label. */
  children: ReactNode;
}

/**
 * Triggers an action. Use `primary` for the main action, `secondary` for alternatives,
 * `ghost` for low-emphasis actions and `danger` for destructive ones.
 * @a11y The label must describe the action. For icon-only buttons use IconButton.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading = false, disabled, type = "button", children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size })}
      {...rest}
    >
      {loading ? <IconSpinner /> : null}
      {children}
    </button>
  );
});

export interface IconButtonProps extends ButtonBaseProps, NativeProps<"button"> {
  /**
   * Accessible name in Finnish, e.g. "Poista asiakas".
   * @a11y Required: there is no visible text.
   */
  "aria-label": string;
  /** Decorative icon, e.g. from the design system icon set. It is hidden from assistive technology. */
  icon: ReactNode;
}

/**
 * Square button with only an icon. Prefer Button with a visible label when space allows.
 * @a11y The `aria-label` prop is required and must be Finnish and action-oriented.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant, size, loading = false, disabled, type = "button", icon, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, iconOnly: true })}
      {...rest}
    >
      {loading ? <IconSpinner /> : <span aria-hidden="true">{icon}</span>}
    </button>
  );
});
