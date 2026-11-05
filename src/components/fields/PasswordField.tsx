"use client";

import { useState, type PointerEvent, type KeyboardEvent } from "react";

import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { cn } from "@/helpers/cn";

import Field from "./Field";
import { useFieldTheme } from "./theme";
import type { TextFieldProps } from "./TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type"> & {
  reveal?: "hold" | "toggle";
};

export default function PasswordField({
  reveal = "toggle",
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
}: PasswordFieldProps) {
  const theme = useFieldTheme({ classes, tokens });
  const [visible, setVisible] = useState(false);

  function revealPassword(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setVisible(true);
  }

  function hidePassword() {
    setVisible(false);
  }

  function holdWithKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== " " && event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    setVisible(event.type === "keydown");
  }

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
        <div className="relative">
          <input
            {...inputProps}
            {...a11y}
            required={required}
            type={visible ? "text" : "password"}
            className={cn(theme.classes.control, "pe-11", inputClassName)}
          />
          <button
            type="button"
            className="field-adornment absolute inset-y-0 end-0 flex items-center px-3"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={
              reveal === "toggle" ? () => setVisible((current) => !current) : undefined
            }
            onPointerDown={reveal === "hold" ? revealPassword : undefined}
            onPointerUp={reveal === "hold" ? hidePassword : undefined}
            onPointerCancel={reveal === "hold" ? hidePassword : undefined}
            onLostPointerCapture={reveal === "hold" ? hidePassword : undefined}
            onKeyDown={reveal === "hold" ? holdWithKeyboard : undefined}
            onKeyUp={reveal === "hold" ? holdWithKeyboard : undefined}
            onBlur={reveal === "hold" ? hidePassword : undefined}
          >
            <IconifyIcon
              icon={visible ? "lucide:eye-off" : "lucide:eye"}
              className="h-5 w-5"
            />
          </button>
        </div>
      )}
    </Field>
  );
}
