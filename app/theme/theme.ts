import { DEFAULT_THEME, THEMES, type ThemeId } from "@/design-system/tokens/themes.generated";

export const THEME_STORAGE_KEY = "ds-theme";
const THEME_CHANGE_EVENT = "ds-theme-change";

export const THEME_OPTIONS = THEMES.map(({ id, label }) => ({ value: id, label }));

/**
 * Runs in <head> before first paint: applies the saved theme to <html>, so a returning visitor never
 * sees the default theme flash. Theme ids come from the generated list; anything else is ignored.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(
  THEMES.map(({ id }) => id),
)}.indexOf(t)>-1)document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

export function isThemeId(value: string | null): value is ThemeId {
  return THEMES.some(({ id }) => id === value);
}

/** The active theme: whatever <html data-theme> says (set by the init script or by setTheme). */
export function getTheme(): ThemeId {
  const current = document.documentElement.getAttribute("data-theme");
  return isThemeId(current) ? current : DEFAULT_THEME;
}

export function getServerTheme(): ThemeId {
  return DEFAULT_THEME;
}

export function subscribeToTheme(onChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
}

export function setTheme(theme: ThemeId) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}
