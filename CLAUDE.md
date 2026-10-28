# CLAUDE.md

A design system built to be used by an LLM, plus a Finnish B2B product (customer management and invoicing) built with it.
Next.js App Router, TypeScript strict, Tailwind 3, Storybook.

@AGENTS.md

## Language

- This file, component guides, specs and code comments: **English**.
- All text shown to end users: **Finnish** (labels, buttons, errors, empty states, `aria-label`s, `<html lang="fi">`).
- Finnish UI text uses sentence case ("Lisää asiakas", not "Lisää Asiakas"). Short and direct: verbs for actions, nouns for labels.
- Format with `Intl` and the `fi-FI` locale: currency `EUR` (`1 234,50 €`), dates `d.M.yyyy`, decimals with comma. Never hand-format.

## Where to look first

1. **`design-system/manifest.json`**: first stop when choosing a component. It lists every component with its description, props, variants, sizes, required a11y props and the path to its guide.
2. **`design-system/components/<Name>/<Name>.md`**: read the guide of every component you are about to use (examples and "don't" rules).
3. **`design-system/tokens/tokens.json`**: the only source of colors, type, spacing, radii, shadows, z-index, breakpoints and themes.

## Rules (non-negotiable)

1. **Only design system components and tokens.** Views in `app/` compose components from `@/design-system/components`. Do not hand-build buttons, inputs, tables, dialogs, etc.
2. **Missing component? Add it to the design system first**: component, story, guide, manifest. Do not make one-off components in `app/`.
3. **No hardcoded styles.** No hex/rgb colors, no inline `style`, no arbitrary Tailwind values (`w-[12px]`, `bg-[#fff]`), no raw palette names (`bg-blue-500`; they do not exist). The Tailwind theme is replaced by tokens, so only token utilities work: `bg-surface`, `text-content-muted`, `p-4`, `rounded-md`, `shadow-md`, `md:flex`. ESLint enforces this.
4. **Token changes happen in `tokens.json` only**, then `npm run tokens:build`. Never edit `tokens.css`, `themes.generated.ts` or `manifest.json` by hand.
5. **Radix is an implementation detail.** `@radix-ui/*` may only be imported inside `design-system/`. Views import from the barrel `@/design-system/components`, never from a component folder.
6. **Components expose fixed variants, not `className`.** Do not add a `className` escape hatch to make a view look different. Add a variant to the component instead.
7. **Responsive** with the token breakpoints (`sm` 640, `md` 768, `lg` 1024, `xl` 1280), mobile-first.

## Themes

The design system has themes (`default`, `forest`, `dark`), selected with `data-theme` on `<html>`. A view must look right in all of them without knowing which is active.

- **Never hardcode colors.** Use semantic token utilities (`bg-surface`, `text-content`, `border-border`, `bg-primary text-primary-text`, `bg-success-bg text-success-text`). A hex value, an `rgb()`, or a raw palette name would not change with the theme, and breaks dark mode.
- **Never use the palette directly** (`palette.*` has no Tailwind utilities on purpose). The palette is shared by all themes; only semantic tokens point at it.
- **Themes only change semantic tokens**: `color.*`, `radius.*` and `font.family.*` under `themes.<id>` in `tokens.json`. A theme never changes spacing, type scale, shadows, z-index or breakpoints, and never adds a component variant.
- **Do not branch on the theme in components or views** (no `theme === "dark"`, no `dark:` variants). If something looks wrong in one theme, fix the token, not the component.
- Use the documented token pairs (`bg-primary text-primary-text`, `bg-success-bg text-success-text`, `text-content` on `bg-surface`...). `npm run tokens:contrast` checks them in every theme.

### Adding a theme

1. In `tokens.json` add `themes.<id>` with `label` (Finnish, shown in the selector), `scheme` (`light` or `dark`) and only the semantic tokens that differ (`color`, `radius`, optionally `font.family`). Reference palette entries with `{palette.group.shade}`; add new shades to `palette` when needed (they are shared and invisible to the other themes).
2. `npm run tokens:build`. This adds a `[data-theme="<id>"]` block to `tokens.css` and the theme to `themes.generated.ts`. Unknown token names fail the build.
3. `npm run tokens:contrast`. Fix any failing pair in `tokens.json` (text 4.5:1; UI boundaries, focus ring 3:1).
4. `npm run verify`. Storybook runs every story with axe once per theme, and Playwright runs `/customers` with axe in every theme. The selector, the Storybook toolbar and the tests pick up the new theme automatically.
5. `npm run screenshots` and, if you show themes in the README, add the new screenshot.

## Accessibility (WCAG 2.2 AA)

- Every interactive element is reachable and operable by keyboard; focus is always visible (`focus-visible` ring from the `focus` token). Never remove outlines.
- Every form control has a visible label (the `Input`/`Select` label prop is required). Errors are text, linked via `aria-describedby`, and not conveyed by color alone.
- Icon-only controls need an accessible name in Finnish.
- Status is never color only: `Badge` and `Alert` always carry text.
- Dialogs have a title and description, trap focus, close on Esc, and return focus.
- Tables have a caption, `th` with `scope`, and `aria-sort` on sortable columns.
- Text contrast: 4.5:1 (3:1 for large text and UI boundaries). Token pairs are chosen to meet this; use the documented pairs (`bg-success-bg text-success-text`, `bg-primary text-primary-text`).
- Page structure: one `h1`, no skipped heading levels, landmarks (`main`, `nav`).
- Respect `prefers-reduced-motion` for any animation.
- Storybook runs axe on every story with `a11y.test: "error"`; a violation fails the build.

## Workflow: spec → view

1. **Spec**: copy `docs/specs/_template.md` to `docs/specs/<view>.md`. Describe purpose, users, data, states (loading, empty, error), interactions, Finnish copy, a11y notes.
2. **Choose components**: read `manifest.json` and the guides. List which components the view needs.
3. **Fill gaps**: if something is missing, add it to the design system (steps below) and commit separately.
4. **Build the view** in `app/` using only design system components and tokens.
5. **Verify**: `npm run verify`, `npm run build`, and look at the view in a browser (all states, keyboard only, narrow width).
6. **Commit** with a conventional message (`feat(view): ...`).

### Adding or changing a component

1. Create `design-system/components/<Name>/` with `<Name>.tsx`, `<Name>.stories.tsx`, `<Name>.md`; export it from `design-system/components/index.ts`.
2. In `<Name>.tsx`: `forwardRef`, variants via `cva`, token utilities only, an exported `<Name>Props` type. Document for the manifest: JSDoc description on the component; JSDoc on every prop; `@default` where relevant; `@a11y <note>` on props that exist for accessibility; `@a11y <note>` on the component for general requirements. Variant props are named `variant` or `tone`; the size prop is named `size`.
3. Stories: Finnish content, every variant, size and state.
4. Guide (`<Name>.md`): purpose, import, props overview, 2-3 examples, "Don't" list, a11y notes.
5. `npm run manifest:build`, then `npm run verify`.
6. One commit per component.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Next dev server (regenerates tokens first) |
| `npm run build` | Production build |
| `npm run storybook` | Storybook on :6006 |
| `npm run build-storybook` | Static Storybook build |
| `npm run tokens:build` | Regenerate `tokens.css` and `themes.generated.ts` from `tokens.json` |
| `npm run tokens:check` | Fail if `tokens.css` or `themes.generated.ts` is stale |
| `npm run tokens:contrast` | WCAG contrast of every text, UI and focus pair in every theme; fails below 4.5:1 (text) or 3:1 (UI, focus) |
| `npm run manifest:build` | Regenerate `design-system/manifest.json` from component source |
| `npm run manifest:check` | Fail if `manifest.json` is stale |
| `npm run check` | `tokens:check` + `manifest:check` + `tokens:contrast` |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | ESLint, including the style and import rules |
| `npm test` | Runs every story in headless Chromium with axe, once per theme, plus unit tests |
| `npm run test:e2e` | Playwright against the production build at 375 px and 1280 px: axe in all states and themes, keyboard and focus tests |
| `npm run screenshots` | Build, start and capture `docs/screenshots/` (all states and each theme) |
| `npm run verify` | `check` + `typecheck` + `lint` + `test` + `test:e2e`; run before every commit |

## Project layout

```
design-system/
  manifest.json          generated component index
  build-manifest.mjs
  tokens/                tokens.json (source, incl. themes), tokens.css + themes.generated.ts (generated), tailwind-theme.cjs, check-contrast.mjs
  components/<Name>/     <Name>.tsx, .stories.tsx, .md
  components/index.ts    public barrel
docs/specs/              view specs
app/                     Next.js routes (views)
```

## Git

Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`), one logical step per commit.
