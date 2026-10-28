import type { Preview } from "@storybook/nextjs-vite";
import "../design-system/tokens/tokens.css";
import "../app/globals.css";
import { DEFAULT_THEME, THEMES } from "../design-system/tokens/themes.generated";

// The theme tests (vitest.config.ts) run every story once per theme by setting this variable.
const initialTheme: string = import.meta.env.STORYBOOK_THEME ?? DEFAULT_THEME;

const preview: Preview = {
  initialGlobals: { theme: initialTheme },
  globalTypes: {
    theme: {
      description: "Theme (data-theme on the document root)",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        dynamicTitle: true,
        items: THEMES.map(({ id, label }) => ({ value: id, title: label })),
      },
    },
  },
  decorators: [
    (Story, context) => {
      // On the root element, so portals (Dialog, Select list) and the page background follow the theme.
      document.documentElement.dataset.theme = context.globals.theme ?? DEFAULT_THEME;
      return <Story />;
    },
  ],
  parameters: {
    // Accessibility violations fail the Storybook test run.
    a11y: { test: "error" },
  },
};

export default preview;
