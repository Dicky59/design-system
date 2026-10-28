import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

import { THEMES } from './design-system/tokens/themes.generated';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Every story runs (with axe) once per theme: one Vitest project per theme id from tokens.json.
// .storybook/preview.tsx reads STORYBOOK_THEME to pick the theme.
// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const storybookProjects = THEMES.map(({ id }) => ({
  extends: true as const,
  plugins: [
    // The plugin will run tests for the stories defined in your Storybook config
    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
    storybookTest({ configDir: path.join(dirname, '.storybook') }),
  ],
  test: {
    name: `storybook-${id}`,
    env: { STORYBOOK_THEME: id },
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: 'chromium' as const }],
    },
  },
}));

export default defineConfig({
  test: {
    projects: [
      ...storybookProjects,
      {
        // Pure functions (filtering, sorting, validation, formatting) run in plain Node.
        test: {
          name: 'unit',
          environment: 'node',
          include: ['app/**/*.test.ts'],
        },
      },
    ],
  },
});
