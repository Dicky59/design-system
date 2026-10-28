import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    // Accessibility violations fail the Storybook test run.
    a11y: { test: "error" },
  },
};

export default preview;
