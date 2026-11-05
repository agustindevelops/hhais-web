"use client";

import { useMemo, type ReactNode } from "react";

import {
  FieldThemeContext,
  mergeFieldTheme,
  useFieldTheme,
  type FieldClasses,
  type FieldTokens,
} from "./theme";

type FieldThemeProviderProps = {
  tokens?: FieldTokens;
  classes?: Partial<FieldClasses>;
  children: ReactNode;
};

export default function FieldThemeProvider({
  tokens,
  classes,
  children,
}: FieldThemeProviderProps) {
  const parent = useFieldTheme();
  const theme = useMemo(
    () => mergeFieldTheme(parent, { tokens, classes }),
    [parent, tokens, classes],
  );

  return (
    <FieldThemeContext.Provider value={theme}>
      {children}
    </FieldThemeContext.Provider>
  );
}
