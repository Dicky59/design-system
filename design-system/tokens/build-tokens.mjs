// Generates from tokens.json:
//   - tokens.css: CSS custom properties. `:root` is the default theme; every other theme becomes a
//     `[data-theme="<id>"]` block that re-declares only the semantic tokens it overrides.
//   - themes.generated.ts: the list of theme ids and labels, for the theme selector.
// Usage: node build-tokens.mjs [--check]   (--check fails if either output is stale)
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { readTokens, varName, resolveValue } = require("./tokens-lib.cjs");

const here = path.dirname(fileURLToPath(import.meta.url));

function rootBlock(t) {
  const lines = [];
  const add = (name, value) => lines.push(`  ${name}: ${value};`);

  for (const [group, shades] of Object.entries(t.palette)) {
    for (const [shade, value] of Object.entries(shades)) add(varName("palette", group, shade), value);
  }
  for (const [name, value] of Object.entries(t.color)) add(varName("color", name), resolveValue(value));
  for (const [name, value] of Object.entries(t.font.family)) add(varName("font-family", name), value);
  for (const [name, { size, lineHeight }] of Object.entries(t.font.size)) {
    add(varName("font-size", name), size);
    add(varName("line-height", name), lineHeight);
  }
  for (const [name, value] of Object.entries(t.font.weight)) add(varName("font-weight", name), value);
  for (const [name, value] of Object.entries(t.space)) add(varName("space", name), value);
  for (const [name, value] of Object.entries(t.radius)) add(varName("radius", name), value);
  for (const [name, value] of Object.entries(t.shadow)) add(varName("shadow", name), value);
  for (const [name, value] of Object.entries(t.zIndex)) add(varName("z", name), value);
  for (const [name, value] of Object.entries(t.breakpoint)) add(varName("breakpoint", name), value);

  return `:root {\n${lines.join("\n")}\n}`;
}

// A theme re-declares only the semantic tokens it overrides. Unknown token names fail the build,
// so a typo cannot silently do nothing.
function themeBlock(t, id, theme) {
  const lines = [];
  const add = (name, value) => lines.push(`  ${name}: ${value};`);
  const overrides = [
    ["color", theme.color, t.color, (value) => resolveValue(value)],
    ["radius", theme.radius, t.radius, (value) => value],
    ["font-family", theme.font?.family, t.font.family, (value) => value],
  ];
  for (const [group, values, known, resolve] of overrides) {
    for (const [name, value] of Object.entries(values ?? {})) {
      if (!(name in known)) throw new Error(`Theme "${id}" overrides unknown ${group} token "${name}"`);
      add(varName(group, name), resolve(value));
    }
  }
  if (theme.scheme === "dark") add("color-scheme", "dark");
  return `[data-theme="${id}"] {\n${lines.join("\n")}\n}`;
}

function generateCss() {
  const t = readTokens();
  const blocks = [rootBlock(t)];
  for (const [id, theme] of Object.entries(t.themes ?? {})) {
    if (id !== "default") blocks.push(themeBlock(t, id, theme)); // default = the base values in :root
  }
  return `/* GENERATED from tokens.json by build-tokens.mjs. Do not edit. */\n${blocks.join("\n\n")}\n`;
}

function generateThemesTs() {
  const themes = Object.entries(readTokens().themes ?? {});
  const rows = themes.map(([id, theme]) => `  { id: ${JSON.stringify(id)}, label: ${JSON.stringify(theme.label)} },`);
  return [
    "// GENERATED from tokens.json by build-tokens.mjs. Do not edit.",
    "export const THEMES = [",
    ...rows,
    "] as const;",
    "",
    'export type ThemeId = (typeof THEMES)[number]["id"];',
    "",
    'export const DEFAULT_THEME: ThemeId = "default";',
    "",
  ].join("\n");
}

const outputs = [
  { name: "tokens.css", file: path.join(here, "tokens.css"), content: generateCss() },
  { name: "themes.generated.ts", file: path.join(here, "themes.generated.ts"), content: generateThemesTs() },
];
const normalize = (text) => text.replace(/\r\n/g, "\n");

if (process.argv.includes("--check")) {
  const stale = outputs.filter(
    ({ file, content }) => (fs.existsSync(file) ? normalize(fs.readFileSync(file, "utf8")) : "") !== content,
  );
  if (stale.length > 0) {
    console.error(`${stale.map(({ name }) => name).join(" and ")} stale. Run \`npm run tokens:build\`.`);
    process.exit(1);
  }
  console.log("tokens.css and themes.generated.ts are up to date.");
} else {
  for (const { file, content } of outputs) {
    fs.writeFileSync(file, content);
    console.log(`Wrote ${path.relative(process.cwd(), file)}`);
  }
}
