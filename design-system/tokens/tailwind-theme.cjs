// Maps design tokens to a Tailwind theme. Used with `theme` (not `extend`) so the default
// palette, spacing and breakpoints do not exist: only token-backed utilities can be generated.
const { readTokens, ref } = require("./tokens-lib.cjs");

const t = readTokens();

const mapRefs = (group, prefix) =>
  Object.fromEntries(Object.keys(group).map((key) => [key, ref(prefix, key)]));

const colors = {
  transparent: "transparent",
  current: "currentColor",
  ...mapRefs(t.color, "color"),
};

module.exports = {
  colors,
  // Class names must stay in sync with the CSS variable names (see tokens-lib.cjs).
  borderColor: { ...colors, DEFAULT: ref("color", "border") },
  ringColor: { ...colors, DEFAULT: ref("color", "focus") },
  divideColor: { ...colors, DEFAULT: ref("color", "border") },
  spacing: mapRefs(t.space, "space"),
  borderRadius: mapRefs(t.radius, "radius"),
  boxShadow: mapRefs(t.shadow, "shadow"),
  zIndex: mapRefs(t.zIndex, "z"),
  fontFamily: Object.fromEntries(
    Object.keys(t.font.family).map((key) => [key, [ref("font-family", key)]]),
  ),
  fontSize: Object.fromEntries(
    Object.keys(t.font.size).map((key) => [
      key,
      [ref("font-size", key), { lineHeight: ref("line-height", key) }],
    ]),
  ),
  fontWeight: mapRefs(t.font.weight, "font-weight"),
  // Media queries cannot use var(), so breakpoints are read from the JSON directly.
  screens: { ...t.breakpoint },
};
