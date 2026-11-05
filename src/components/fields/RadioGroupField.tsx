"use client";

import { useId, type ReactNode } from "react";

import { cn } from "@/helpers/cn";

import { fieldTokenStyle, useFieldTheme, type FieldClasses, type FieldTokens } from "./theme";

export type RadioOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
};

type RadioGroupFieldProps = {
  name: string;
  label: ReactNode;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  classes?: Partial<FieldClasses>;
  tokens?: FieldTokens;
};

export default function RadioGroupField({
  name,
  label,
  options,
  value,
  onChange,
  hint,
  error,
  required,
  className,
  classes,
  tokens,
}: RadioGroupFieldProps) {
  const generatedId = useId();
  const theme = useFieldTheme({ classes, tokens });
  const hintId = hint ? `${generatedId}-hint` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      className={cn(theme.classes.root, className)}
      style={fieldTokenStyle(theme.tokens)}
      aria-describedby={describedBy}
    >
      <legend className="field-legend">
        {label}
        {required ? <span className="field-required"> *</span> : null}
      </legend>
      <div className="grid gap-2">
        {options.map((option) => {
          const optionId = `${generatedId}-${option.value}`;
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2",
                selected
                  ? "border-[var(--field-ring)] bg-primary/10"
                  : "border-[var(--field-border)] bg-[var(--field-bg)]",
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                required={required}
                checked={selected}
                aria-invalid={error ? true : undefined}
                onChange={() => onChange(option.value)}
                className="field-radio"
              />
              <span>
                <span className={theme.classes.label} style={{ marginBottom: 0 }}>
                  {option.label}
                </span>
                {option.description ? (
                  <span className={`${theme.classes.hint} mt-1 block`}>
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
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
    </fieldset>
  );
}
