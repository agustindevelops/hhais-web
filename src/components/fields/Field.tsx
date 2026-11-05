"use client";

import { useId, type ReactNode } from "react";

import { cn } from "@/helpers/cn";

import {
  fieldTokenStyle,
  useFieldTheme,
  type FieldClasses,
  type FieldTokens,
} from "./theme";

export type FieldA11y = {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

export type FieldProps = {
  id?: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  classes?: Partial<FieldClasses>;
  tokens?: FieldTokens;
  children: (a11y: FieldA11y) => ReactNode;
};

export default function Field({
  id,
  label,
  hint,
  error,
  required,
  className,
  classes,
  tokens,
  children,
}: FieldProps) {
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
      <label htmlFor={fieldId} className={theme.classes.label}>
        {label}
        {required ? (
          <span className="field-required"> *</span>
        ) : null}
      </label>
      {children({
        id: fieldId,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
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
