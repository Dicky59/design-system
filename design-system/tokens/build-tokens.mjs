// Generates tokens.css (CSS custom properties) from tokens.json.
// Usage: node build-tokens.mjs [--check]   (--check fails if tokens.css is stale)
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { readTokens, varName, resolveValue } = require("./tokens-lib.cjs");

const here = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(here, "tokens.css");

function generate() {
  const t = readTokens();
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

  return `/* GENERATED from tokens.json by build-tokens.mjs. Do not edit. */\n:root {\n${lines.join("\n")}\n}\n`;
}

const css = generate();
const normalize = (s) => s.replace(/\r\n/g, "\n");

if (process.argv.includes("--check")) {
  const current = fs.existsSync(outPath) ? normalize(fs.readFileSync(outPath, "utf8")) : "";
  if (current !== css) {
    console.error("tokens.css is stale. Run `npm run tokens:build`.");
    process.exit(1);
  }
  console.log("tokens.css is up to date.");
} else {
  fs.writeFileSync(outPath, css);
  console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
}
