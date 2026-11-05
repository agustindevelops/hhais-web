"use client";

import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/helpers/cn";

import Field, { type FieldProps } from "./Field";
import { useFieldTheme } from "./theme";

type SelectFieldProps = Omit<FieldProps, "children"> &
  Omit<ComponentProps<"select">, "id" | "className"> & {
    inputClassName?: string;
    children: ReactNode;
  };

export default function SelectField({
  id,
  label,
  hint,
  error,
  required,
  className,
  classes,
  tokens,
  inputClassName,
  children,
  ...selectProps
}: SelectFieldProps) {
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
        <select
          {...selectProps}
          {...a11y}
          required={required}
          className={cn(theme.classes.control, inputClassName)}
        >
          {children}
        </select>
      )}
    </Field>
  );
}
