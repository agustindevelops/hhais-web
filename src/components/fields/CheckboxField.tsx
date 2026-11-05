"use client";

import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/helpers/cn";

import { fieldTokenStyle, useFieldTheme, type FieldClasses, type FieldTokens } from "./theme";

type CheckboxFieldProps = Omit<ComponentProps<"input">, "id" | "type" | "className" | "size"> & {
  id?: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  classes?: Partial<FieldClasses>;
  tokens?: FieldTokens;
};

export default function CheckboxField({
  id,
  label,
  hint,
  error,
  required,
  className,
  classes,
  tokens,
  ...inputProps
}: CheckboxFieldProps) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const theme = useFieldTheme({ classes, tokens });
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={cn(theme.classes.root, className)}
      style={fieldTokenStyle(theme.tokens)}
    >
      <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-2">
        <input
          {...inputProps}
          id={fieldId}
          type="checkbox"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="field-check"
        />
        <span className={theme.classes.label} style={{ marginBottom: 0 }}>
          {label}
        </span>
      </label>
      {error ? (
        <p id={errorId} className={theme.classes.error} role="alert">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className={theme.classes.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
