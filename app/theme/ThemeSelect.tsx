"use client";

import { useSyncExternalStore } from "react";
import { Select } from "@/design-system/components";
import { getServerTheme, getTheme, isThemeId, setTheme, subscribeToTheme, THEME_OPTIONS } from "./theme";

/** Theme picker built from the design system Select. The choice is saved in localStorage. */
export function ThemeSelect() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
  return (
    <Select
      label="Teema"
      options={THEME_OPTIONS}
      value={theme}
      onValueChange={(value) => isThemeId(value) && setTheme(value)}
    />
  );
}
