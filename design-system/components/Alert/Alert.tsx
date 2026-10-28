import { cva } from "class-variance-authority";
import { forwardRef, type ReactNode } from "react";
import { IconError, IconInfo, IconSuccess, IconWarning, IconX } from "../../lib/icons";
import { focusRing, type NativeProps } from "../../lib/styles";

const alertStyles = cva("flex items-start gap-3 rounded-lg border p-4 text-sm", {
  variants: {
    tone: {
      info: "border-info-border bg-info-bg text-info-text",
      success: "border-success-border bg-success-bg text-success-text",
      warning: "border-warning-border bg-warning-bg text-warning-text",
      danger: "border-danger-border bg-danger-bg text-danger-text",
    },
  },
  defaultVariants: { tone: "info" },
});

const icons = { info: IconInfo, success: IconSuccess, warning: IconWarning, danger: IconError };

export interface AlertProps extends Omit<NativeProps<"div">, "role" | "title"> {
  /**
   * Meaning of the message. `warning` and `danger` interrupt screen readers (role="alert");
   * `info` and `success` are announced politely (role="status").
   * @default "info"
   */
  tone?: "info" | "success" | "warning" | "danger";
  /** Short bold summary in Finnish, e.g. "Tallennus epäonnistui". */
  title?: string;
  /** Called when the user dismisses the alert. When set, a close button is shown. */
  onDismiss?: () => void;
  /**
   * Accessible name of the dismiss button.
   * @default "Sulje ilmoitus"
   */
  dismissLabel?: string;
  /** Message text in Finnish: what happened and what to do next. */
  children: ReactNode;
}

/**
 * Inline message about the state of the page or a task. Not for blocking questions (use Dialog).
 * @a11y The role is set from the tone. The message is text plus an icon, so it never relies on color alone.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = "info", title, onDismiss, dismissLabel = "Sulje ilmoitus", children, ...rest },
  ref,
) {
  const Icon = icons[tone];
  return (
    <div
      ref={ref}
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={alertStyles({ tone })}
      {...rest}
    >
      <span className="mt-0.5">
        <Icon />
      </span>
      <div className="flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={`-m-1 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface ${focusRing}`}
        >
          <IconX />
        </button>
      ) : null}
    </div>
  );
});
