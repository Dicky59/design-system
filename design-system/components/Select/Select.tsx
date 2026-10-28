import * as RadixSelect from "@radix-ui/react-select";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { controlBorder, controlStyles, Field, useFieldIds } from "../../lib/field";
import { IconCheck, IconChevronDown } from "../../lib/icons";

export interface SelectOption {
  /** Value submitted with the form. Must not be an empty string. */
  value: string;
  /** Visible Finnish text. */
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /**
   * Visible label, in Finnish.
   * @a11y Required: the control has no other accessible name.
   */
  label: string;
  /** Choices. Keep the list short; for long lists add search first. */
  options: SelectOption[];
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the chosen option value. */
  onValueChange?: (value: string) => void;
  /**
   * Text shown when nothing is selected.
   * @default "Valitse"
   */
  placeholder?: string;
  /** Helper text linked with `aria-describedby`. */
  hint?: string;
  /**
   * Error message. Marks the control invalid and links the message to it.
   * @a11y Say what is wrong and how to fix it.
   */
  error?: string;
  /** Marks the field as required and shows an asterisk. */
  required?: boolean;
  disabled?: boolean;
  /** Form field name; a hidden native select is rendered so the value is submitted with the form. */
  name?: string;
  id?: string;
}

/**
 * Dropdown for choosing one option, with built-in label, hint and error message.
 * @a11y Keyboard: Enter/Space/arrows open the list, arrows move, type-ahead jumps, Esc closes.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { label, options, value, defaultValue, onValueChange, placeholder = "Valitse", hint, error, required, disabled, name, id: idProp },
  ref,
) {
  const { id, hintId, errorId, controlProps } = useFieldIds(idProp, hint, error);
  return (
    <Field id={id} label={label} required={required} hint={hint} hintId={hintId} error={error} errorId={errorId}>
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
        name={name}
      >
        <RadixSelect.Trigger
          ref={ref}
          className={cn(
            controlStyles,
            controlBorder(Boolean(error)),
            "flex items-center justify-between gap-2 text-left data-placeholder:text-content-muted",
          )}
          {...controlProps}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <IconChevronDown />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className="z-popover overflow-hidden rounded-md border border-border bg-surface shadow-md">
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="relative flex cursor-default select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm text-content outline-none data-highlighted:bg-primary-subtle data-highlighted:text-primary-subtle-text data-disabled:text-content-disabled"
                >
                  <span className="absolute left-2 flex items-center">
                    <RadixSelect.ItemIndicator>
                      <IconCheck />
                    </RadixSelect.ItemIndicator>
                  </span>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </Field>
  );
});
