// Shared token helpers used by the CSS generator and the Tailwind theme.
const fs = require("node:fs");
const path = require("node:path");

const TOKENS_PATH = path.join(__dirname, "tokens.json");

function readTokens() {
  return JSON.parse(fs.readFileSync(TOKENS_PATH, "utf8"));
}

// "0.5" -> "0_5" so the name is a valid CSS custom property segment.
const seg = (key) => key.replace(/\./g, "_");

// Path segments -> `--ds-...`
const varName = (...parts) => `--ds-${parts.map(seg).join("-")}`;
const ref = (...parts) => `var(${varName(...parts)})`;

// Turn "{palette.brand.600}" into var(--ds-palette-brand-600); leave literals alone.
function resolveValue(value) {
  const match = /^\{([^}]+)\}$/.exec(value);
  return match ? ref(...match[1].split(".")) : value;
}

module.exports = { readTokens, varName, ref, resolveValue };
