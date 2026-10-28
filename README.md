# Design system for LLMs + Asiakkaat (Customers) view

A design system built so that an LLM can use it without guessing, and a Finnish B2B customer management view built from a written spec as proof.

**Why this project (FI):** Tekoälyn tekemä käyttöliittymä näyttää usein hyvältä mutta rikkoo suunnittelujärjestelmän: keksittyjä värejä, omia nappeja, puuttuvia saavutettavuusasioita. Tässä projektissa suunnittelujärjestelmä on rakennettu niin, että väärin tekeminen on vaikeaa: vain tokenit, koneluettava komponenttihakemisto ja tarkistukset, jotka kaatavat virheelliset muutokset. Todisteena on asiakasnäkymä, jonka Claude Code rakensi kirjoitetusta speksistä.

**Why this project (EN):** AI-generated UI often looks fine but breaks the design system: invented colors, hand-built buttons, missing accessibility. Here the system is built so the wrong thing is hard to do: token-only styling, a machine-readable component index, and checks that fail bad changes. The proof is a customers view that Claude Code built from a written spec.

<p align="center">
  <img src="docs/screenshots/customers-theme-default-1280.png" alt="Customers view, default theme" width="32%">
  <img src="docs/screenshots/customers-theme-forest-1280.png" alt="Customers view, forest theme" width="32%">
  <img src="docs/screenshots/customers-theme-dark-1280.png" alt="Customers view, dark theme" width="32%">
</p>

- **Live demo:** https://design-system-llm.vercel.app/customers
- **Storybook:** https://design-system-llm-storybook-xi.vercel.app/

Designed and directed by Pekka Laine, built with Claude Code.

## Screenshots

Captured with `npm run screenshots` (real 375 px and 1280 px viewports).

| Desktop 1280 px | Mobile 375 px |
|---|---|
| ![Customers, desktop](docs/screenshots/customers-default-1280.png) | ![Customers, mobile](docs/screenshots/customers-default-375.png) |
| ![Details dialog, invoices tab, desktop](docs/screenshots/customers-details-invoices-1280.png) | ![Details dialog, mobile](docs/screenshots/customers-details-info-375.png) |
| ![New customer with validation errors, desktop](docs/screenshots/customers-new-customer-errors-1280.png) | ![New customer with validation errors, mobile](docs/screenshots/customers-new-customer-errors-375.png) |
| ![Empty state, desktop](docs/screenshots/customers-empty-1280.png) | ![Error state, mobile](docs/screenshots/customers-error-375.png) |

More states (both details tabs, error and empty at both widths) are in `docs/screenshots/`.

## The idea

Most design systems are written for people. This one is written for an LLM that has to build views from it:

1. **One source of truth.** `design-system/tokens/tokens.json` holds colors, type, spacing, radii, shadows and breakpoints.
2. **Components with fixed variants.** 14 components (Button, Input, Select, Table, Dialog, ...). They take `variant`/`tone`/`size`, never `className`.
3. **A manifest.** `design-system/manifest.json` is generated from the component source: description, props, variants, required accessibility props, guide path. An LLM reads it first to choose components.
4. **Guides with rules.** Each component has a `.md` guide with examples and "Don't" rules.
5. **A spec to view workflow.** A view starts as `docs/specs/<view>.md`. The Customers view was built from `docs/specs/customers.md`.

## Architecture

```mermaid
flowchart LR
  T["tokens.json<br/>(source of truth)"] -->|tokens:build| CSS["tokens.css<br/>CSS variables + [data-theme] blocks"]
  T --> TW["tailwind-theme.cjs<br/>Tailwind theme (replaced, not extended)"]
  CSS --> C
  TW --> C
  subgraph C["Components (design-system/components/Name/)"]
    direction TB
    TSX["Name.tsx"]
    G["Name.md guide<br/>examples + Do/Don't"]
    S["Name.stories.tsx<br/>axe on every story"]
  end
  C -->|manifest:build<br/>reads types + JSDoc| M["manifest.json<br/>generated index"]
  SPEC["docs/specs/view.md"] --> V["View in app/<br/>only DS components + tokens"]
  M --> V
  G --> V
  CL["CLAUDE.md<br/>rules + workflow"] --> V
```

## Themes

Three themes ship with the system: `default`, `forest` (green primary, smaller radii) and `dark`. They are defined in `tokens.json` under `themes` and selected with `data-theme` on `<html>`.

- The **palettes are shared**. A theme overrides only **semantic tokens** (surface, text, border, primary, status colors, focus ring) and may override radii and font families. It never changes spacing, type scale or components.
- `npm run tokens:build` writes `:root` (the default theme, unchanged) and one `[data-theme="..."]` block per other theme. Tailwind needs no changes: components already use `var(--ds-...)` through the token theme.
- `npm run tokens:contrast` checks WCAG contrast for every text, UI and focus-ring pair in every theme (4.5:1 for text, 3:1 for UI and focus) and fails the build below that.
- Storybook has a theme switcher in the toolbar, and every story runs with axe once per theme. Playwright runs `/customers` with axe in all three themes at 375 px and 1280 px.
- The Customers page has a theme selector (the design system `Select`). The choice is saved in `localStorage`, and a small inline script in `<head>` applies it before first paint, so there is no flash of the wrong theme.
- Adding a theme: see "Adding a theme" in `CLAUDE.md`.

| default | forest | dark |
|---|---|---|
| ![Customers, default theme](docs/screenshots/customers-theme-default-1280.png) | ![Customers, forest theme](docs/screenshots/customers-theme-forest-1280.png) | ![Customers, dark theme](docs/screenshots/customers-theme-dark-1280.png) |
| ![Mobile, default theme](docs/screenshots/customers-theme-default-375.png) | ![Mobile, forest theme](docs/screenshots/customers-theme-forest-375.png) | ![Mobile, dark theme](docs/screenshots/customers-theme-dark-375.png) |

## What makes it LLM-reliable

| Mechanism | What it prevents |
|---|---|
| **Token-only Tailwind theme.** The theme is replaced by tokens, so `bg-blue-500` or `p-[13px]` do not exist. | Invented colors and spacing |
| **ESLint rules.** No arbitrary Tailwind values, hex colors or inline `style`; no `@radix-ui/*` imports outside `design-system/`; views import only from the barrel `@/design-system/components`. | Style drift and leaking implementation details |
| **No `className` on components.** Looks change by adding a variant to the component. | One-off overrides in views |
| **`manifest.json`** (generated, never hand-edited). | Guessing which components and props exist |
| **Per-component guides** with Do/Don't rules. | Misusing a component |
| **`CLAUDE.md`** with non-negotiable rules, Finnish copy conventions and the spec to view workflow. | Skipping steps |
| **Check scripts.** `tokens:check` and `manifest:check` fail on stale generated files; `tokens:contrast` fails on low contrast in any theme; `verify` also runs typecheck, lint, Storybook tests (axe on every story in every theme, a violation fails) and the Playwright tests. | Silent regressions |
| **Themes are tokens only.** A theme overrides semantic tokens, so a view that uses token utilities works in every theme; a hardcoded color is the one thing that breaks dark mode, and lint rejects it. | Colors that ignore the theme |

## How Claude Code built the Customers view

From `docs/specs/customers.md`, one commit per step:

1. **Spec.** Read the spec and added the sections the template requires (status, Finnish copy table, out of scope) without changing its content.
2. **Component audit.** Checked `manifest.json` and the guides against what the view needs. Found gaps: a loading placeholder, a read-only term/value list, a layout primitive for rows and forms, and a page container with a header.
3. **Design system additions first.** Skeleton, DescriptionList, Stack (token-only `gap`, `direction`, `switchAt`; no `className`), PageHeader and Page, each with a story, guide and manifest entry.
4. **The view.** `app/customers/`: mock data, formatters and pure logic in separate files, client view, two dialogs. Invoice status is derived from a fixed `DEMO_TODAY`, so the demo is deterministic. Unit tests cover filtering, sorting, validators, invoice status and formatting.
5. **Checks.** `manifest:check`, `tokens:check`, lint, `tsc`, `next build`, `build-storybook`.
6. **Browser verification.** The real page at 375 px and 1280 px, keyboard-only use (filters, sorting, both dialogs, focus return), all states.
7. **Manual review fixes.** A human review found real issues, fixed in the design system, not in the view:
   - the status Select was empty before hydration (the label is now rendered directly);
   - fields in one row were misaligned because the hint sat above the control (the hint now sits below);
   - the row action was off-screen on mobile (the customer name is now the button, via a `link` Button variant);
   - the scrolling table now has a labelled, focusable region, a flush variant inside Cards and an edge shadow cue.
8. **End-to-end tests.** Playwright + axe on the live page and keyboard/focus tests at both widths.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Next dev server (regenerates tokens first) |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run storybook` | Storybook on :6006 |
| `npm run build-storybook` | Static Storybook build into `storybook-static/` |
| `npm run tokens:build` / `tokens:check` | Generate `tokens.css` and `themes.generated.ts` / fail if stale |
| `npm run tokens:contrast` | WCAG contrast of every text, UI and focus pair in every theme; fails on a miss |
| `npm run manifest:build` / `manifest:check` | Generate `manifest.json` / fail if stale |
| `npm run check` | `tokens:check` + `manifest:check` + `tokens:contrast` |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | ESLint, including the style and import rules |
| `npm test` | Vitest: every story in headless Chromium with axe, once per theme, plus unit tests for the Customers logic |
| `npm run test:e2e` | Playwright against the production build at 375 px and 1280 px: axe in all states and all themes, keyboard and focus tests, theme persistence |
| `npm run verify` | `check` + `typecheck` + `lint` + `test` + `test:e2e`; run before every commit |
| `npm run screenshots` | Build, start, and capture `docs/screenshots/` (all states, and in each theme the default view, the open Select, the dialogs and the alerts) |

First run needs a browser: `npx playwright install chromium`.

## Project structure

```
design-system/
  manifest.json          generated component index
  build-manifest.mjs
  tokens/                tokens.json (source, incl. themes), tokens.css + themes.generated.ts (generated),
                         tailwind-theme.cjs, check-contrast.mjs
  components/<Name>/     <Name>.tsx, .stories.tsx, .md
  components/index.ts    public barrel
  lib/                   shared helpers (cn, field, icons, focus ring)
app/
  customers/             view, dialogs, data/, lib/ (pure logic + unit tests)
  theme/                 theme selector (design system Select) and the no-flash init script
docs/
  specs/                 view specs (customers.md, _template.md)
  screenshots/           generated by npm run screenshots
e2e/                     Playwright tests (axe, keyboard and focus)
scripts/screenshots.mjs
CLAUDE.md                rules and workflow for LLMs
```

## Tech stack

Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 3 (token theme), Radix UI primitives (inside the design system only), class-variance-authority, Storybook 10 with the a11y addon, Vitest 4, Playwright with axe-core.

## Deployment (Vercel, two projects)

Both projects are deployed on Vercel: the [app](https://design-system-llm.vercel.app/customers) and [Storybook](https://design-system-llm-storybook-xi.vercel.app/). Both builds are verified from a clean clone (`npm ci`, `npm run build`, `npm run build-storybook`). The repo has no `vercel.json` on purpose: it would apply to both projects, so each project is configured in its Vercel settings.

To recreate them, make two Vercel projects from the same Git repository:

| | App | Storybook |
|---|---|---|
| Framework preset | Next.js | Other |
| Root directory | `./` | `./` |
| Install command | `npm ci` (default) | `npm ci` |
| Build command | `npm run build` (default) | `npm run build-storybook` |
| Output directory | default (`.next`) | `storybook-static` |
| Node.js version | 20.x or newer | 20.x or newer |
| Environment variables | none | none |

Steps:

1. Push the repository to GitHub.
2. In Vercel, **Add New... > Project**, import the repository, keep the Next.js preset and deploy. This is the app.
3. Add a second project from the same repository. Set the framework preset to **Other** and override the build command and output directory as in the table. This is Storybook.

The app redirects `/` to `/customers` (see `next.config.ts`). Both builds run `tokens:build` first (`prebuild` and `prebuild-storybook`), so `tokens.css` is always fresh.

## Limitations

- All data is fictional and lives in `app/customers/data/`. There is no backend and no persistence: a customer you add is lost on reload.
- Loading (about 500 ms) and the error state are simulated. `?state=error` shows the error on the first load; "Yritä uudelleen" then succeeds.
- Finnish only; text is hardcoded, there is no i18n layer.
- Themes: the dark and forest values were chosen by contrast numbers, not by a designer. The theme follows the saved choice only; it does not follow the OS `prefers-color-scheme`.
- Select focus on error: the form moves focus to the first invalid field by `id`, and `Select` supports `id` and `ref`, so this works. The Customers form has no validation on its Select, so that path is not exercised in the UI.
- Screenshots are stable on one machine; fonts are the system font stack, so other operating systems render slightly differently.
- Not audited with a screen reader: axe and keyboard tests only.

## License

[MIT](LICENSE)
