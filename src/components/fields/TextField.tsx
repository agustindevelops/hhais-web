"use client";

import type { ComponentProps } from "react";

import { cn } from "@/helpers/cn";

import Field, { type FieldProps } from "./Field";
import { useFieldTheme, type FieldClasses, type FieldTokens } from "./theme";

type TextFieldProps = Omit<FieldProps, "children"> &
  Omit<ComponentProps<"input">, "id" | "className" | "size"> & {
    inputClassName?: string;
  };

export default function TextField({
  id,
  label,
  hint,
  error,
  required,
  className,
  classes,
  tokens,
  inputClassName,
  ...inputProps
}: TextFieldProps) {
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
        <input
          {...inputProps}
          {...a11y}
          required={required}
          className={cn(theme.classes.control, inputClassName)}
        />
      )}
    </Field>
  );
}

export type { TextFieldProps, FieldClasses, FieldTokens };
