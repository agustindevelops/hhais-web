"use client";

import type { ComponentProps } from "react";

import { cn } from "@/helpers/cn";

import Field, { type FieldProps } from "./Field";
import { useFieldTheme } from "./theme";

type TextAreaFieldProps = Omit<FieldProps, "children"> &
  Omit<ComponentProps<"textarea">, "id" | "className"> & {
    inputClassName?: string;
  };

export default function TextAreaField({
  id,
  label,
  hint,
  error,
  required,
  className,
  classes,
  tokens,
  inputClassName,
  rows = 4,
  ...inputProps
}: TextAreaFieldProps) {
  const theme = useFieldTheme({ classes, tokens });

  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
      classes={classes}
      tokens={tokens}
    >
      {(a11y) => (
        <textarea
          {...inputProps}
          {...a11y}
          required={required}
          rows={rows}
          className={cn(theme.classes.control, "min-h-28 resize-y", inputClassName)}
        />
      )}
    </Field>
  );
}
