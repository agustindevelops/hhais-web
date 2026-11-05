import { createContext, useContext, useMemo, type CSSProperties } from "react";

export type FieldTokens = {
  background?: string;
  text?: string;
  placeholder?: string;
  border?: string;
  label?: string;
  hint?: string;
  error?: string;
  radius?: string;
  ring?: string;
};

export type FieldClasses = {
  root: string;
  label: string;
  control: string;
  hint: string;
  error: string;
};

export type FieldTheme = {
  tokens: FieldTokens;
  classes: FieldClasses;
};

const tokenVars: Record<keyof FieldTokens, string> = {
  background: "--field-bg",
  text: "--field-text",
  placeholder: "--field-placeholder",
  border: "--field-border",
  label: "--field-label",
  hint: "--field-hint",
  error: "--field-error",
  radius: "--field-radius",
  ring: "--field-ring",
};

export const defaultFieldClasses: FieldClasses = {
  root: "min-w-0",
  label: "field-label",
  control: "field-control",
  hint: "field-hint",
  error: "field-error",
};

export const defaultFieldTheme: FieldTheme = {
  tokens: {},
  classes: defaultFieldClasses,
};

export const FieldThemeContext = createContext<FieldTheme>(defaultFieldTheme);

export function mergeFieldTheme(
  base: FieldTheme,
  override?: { tokens?: FieldTokens; classes?: Partial<FieldClasses> },
): FieldTheme {
  if (!override) {
    return base;
  }
  return {
    tokens: { ...base.tokens, ...override.tokens },
    classes: { ...base.classes, ...override.classes },
  };
}

export function useFieldTheme(override?: {
  tokens?: FieldTokens;
  classes?: Partial<FieldClasses>;
}) {
  const theme = useContext(FieldThemeContext);
  return useMemo(
    () => mergeFieldTheme(theme, override),
    [theme, override],
  );
}

export function fieldTokenStyle(tokens: FieldTokens): CSSProperties | undefined {
  const style: Record<string, string> = {};
  (Object.keys(tokenVars) as (keyof FieldTokens)[]).forEach((key) => {
    const value = tokens[key];
    if (value) {
      style[tokenVars[key]] = value;
    }
  });
  return Object.keys(style).length > 0 ? (style as CSSProperties) : undefined;
}
