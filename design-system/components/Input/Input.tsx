import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { controlBorder, controlStyles, Field, useFieldIds } from "../../lib/field";
import type { NativeProps } from "../../lib/styles";

export interface InputProps extends Omit<NativeProps<"input">, "type" | "size"> {
  /**
   * Visible label, in Finnish. Always shown above the control.
   * @a11y Required: placeholders are not labels.
   */
  label: string;
  /** Helper text shown under the label and linked with `aria-describedby`. */
  hint?: string;
  /**
   * Error message. Setting it marks the control invalid and links the message to it.
   * @a11y Say what is wrong and how to fix it.
   */
  error?: string;
  /** Marks the field as required and shows an asterisk. Explain the asterisk once per form. */
  required?: boolean;
  /**
   * Input type.
   * @default "text"
   */
  type?: "text" | "email" | "tel" | "search" | "number" | "password" | "url";
}

/**
 * Single-line text field with built-in label, hint and error message.
 * @a11y Label is required. Error text is linked via aria-describedby and the control gets aria-invalid.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, required, type = "text", id: idProp, ...rest },
  ref,
) {
  const { id, hintId, errorId, controlProps } = useFieldIds(idProp, hint, error);
  return (
    <Field id={id} label={label} required={required} hint={hint} hintId={hintId} error={error} errorId={errorId}>
      <input
        ref={ref}
        type={type}
        required={required}
        className={cn(controlStyles, controlBorder(Boolean(error)))}
        {...controlProps}
        {...rest}
      />
    </Field>
  );
});
