// WCAG 2.2 contrast check for every theme in tokens.json.
//   text pairs:         4.5:1 (SC 1.4.3)
//   UI + focus pairs:   3:1   (SC 1.4.11, 2.4.13)
// Exits non-zero when any pair fails. Disabled text is exempt, and so is the overlay (it has alpha).
// Usage: node check-contrast.mjs [--verbose]
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { readTokens } = require("./tokens-lib.cjs");

const TEXT = 4.5;
const UI = 3;

// [foreground, background[]] per requirement. Names are semantic color tokens.
const TEXT_PAIRS = [
  ["content", ["surface", "surface-muted", "surface-sunken"]],
  ["content-muted", ["surface", "surface-muted", "surface-sunken"]],
  ["primary-text", ["primary", "primary-hover", "primary-active"]],
  ["primary-subtle-text", ["surface", "surface-muted", "primary-subtle", "primary-subtle-hover"]],
  ["danger-solid-text", ["danger-solid", "danger-solid-hover", "danger-solid-active"]],
  ["neutral-text", ["neutral-bg"]],
  ["success-text", ["success-bg"]],
  ["warning-text", ["warning-bg"]],
  ["danger-text", ["danger-bg", "surface", "surface-muted"]], // also used for field error messages
  ["info-text", ["info-bg"]],
];

const UI_PAIRS = [
  ["border-strong", ["surface"]], // input and select boundaries
  ["focus", ["surface", "surface-muted"]], // focus ring
  ["primary", ["surface"]], // filled button, active tab indicator
  ["danger-solid", ["surface"]], // invalid field border
];

function resolve(tokens, theme, name) {
  const value = theme.color?.[name] ?? tokens.color[name];
  const ref = /^\{palette\.([^.]+)\.([^}]+)\}$/.exec(value);
  const hex = ref ? tokens.palette[ref[1]][ref[2]] : value;
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Cannot resolve ${name} to #rrggbb: ${value}`);
  return hex;
}

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const tokens = readTokens();
const verbose = process.argv.includes("--verbose");
const failures = [];
let checked = 0;

for (const [id, theme] of Object.entries(tokens.themes)) {
  const themeFailures = [];
  const run = (pairs, minimum, kind) => {
    for (const [fg, backgrounds] of pairs) {
      for (const bg of backgrounds) {
        const value = ratio(resolve(tokens, theme, fg), resolve(tokens, theme, bg));
        checked++;
        const ok = value >= minimum;
        if (verbose) console.log(`  ${ok ? "ok  " : "FAIL"} ${value.toFixed(2).padStart(5)}:1  ${kind} ${fg} on ${bg} (min ${minimum})`);
        if (!ok) themeFailures.push(`${id}: ${kind} ${fg} on ${bg} is ${value.toFixed(2)}:1, needs ${minimum}:1`);
      }
    }
  };
  if (verbose) console.log(`${id}:`);
  run(TEXT_PAIRS, TEXT, "text");
  run(UI_PAIRS, UI, "ui  ");
  failures.push(...themeFailures);
}

if (failures.length > 0) {
  console.error(`Contrast check failed (${failures.length} of ${checked} pairs):`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`Contrast OK: ${checked} pairs across ${Object.keys(tokens.themes).length} themes (text 4.5:1, UI and focus 3:1).`);
