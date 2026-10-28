import { useId, type ReactNode } from "react";
import { IconError } from "./icons";

/** Ids and ARIA wiring shared by form controls (Input, Select). */
export function useFieldIds(idProp: string | undefined, hint: string | undefined, error: string | undefined) {
  const generated = useId();
  const id = idProp ?? generated;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return {
    id,
    hintId,
    errorId,
    controlProps: {
      id,
      "aria-describedby": describedBy,
      "aria-invalid": error ? (true as const) : undefined,
    },
  };
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  hintId?: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}

/**
 * Label, control slot, hint and error message. The hint sits below the control (not between label and control),
 * so controls in a row line up whether or not they have a hint. The error has an icon so it is not color-only.
 */
export function Field({ id, label, required, hint, hintId, error, errorId, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-content">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-danger-text">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-sm text-content-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-sm text-danger-text">
          <span className="mt-0.5">
            <IconError />
          </span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/** Shared control surface for text-like inputs and the Select trigger. */
export const controlStyles =
  "h-10 w-full rounded-md border bg-surface px-3 text-base text-content placeholder:text-content-muted " +
  "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-content-disabled " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-0";

export const controlBorder = (hasError: boolean) => (hasError ? "border-danger-solid" : "border-border-strong");
