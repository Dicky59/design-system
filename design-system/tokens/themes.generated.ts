// GENERATED from tokens.json by build-tokens.mjs. Do not edit.
export const THEMES = [
  { id: "default", label: "Oletus" },
  { id: "forest", label: "Metsä" },
  { id: "dark", label: "Tumma" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "default";
