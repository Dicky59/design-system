import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Tailwind utility with an arbitrary value, e.g. `w-[12px]` or `bg-[#fff]`.
const ARBITRARY_VALUE = "(^|[\\s:!])-?[a-z][a-z0-9-]*-\\[";
const HEX_COLOR = "#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$";

const noHardcodedStyles = [
  {
    selector: `Literal[value=/${ARBITRARY_VALUE}/]`,
    message: "Arbitrary Tailwind values (e.g. w-[12px]) are not allowed. Use a token-backed utility.",
  },
  {
    selector: `TemplateElement[value.raw=/${ARBITRARY_VALUE}/]`,
    message: "Arbitrary Tailwind values (e.g. w-[12px]) are not allowed. Use a token-backed utility.",
  },
  {
    selector: `Literal[value=/^${HEX_COLOR}/]`,
    message: "Hardcoded hex colors are not allowed. Use a color token.",
  },
  {
    selector: "JSXAttribute[name.name='style']",
    message: "Inline styles are not allowed. Use token-backed Tailwind utilities or a design system component.",
  },
];

const radixPattern = {
  group: ["@radix-ui/*"],
  message: "Radix is an implementation detail of the design system. Import components from '@/design-system/components'.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["app/**/*.{ts,tsx}", "design-system/**/*.{ts,tsx}", ".storybook/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error", ...noHardcodedStyles],
      "no-restricted-imports": ["error", { patterns: [radixPattern] }],
    },
  },
  {
    // Views may only use the design system through its public barrel.
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            radixPattern,
            {
              group: ["@/design-system/components/*", "**/design-system/components/*"],
              message: "Import from '@/design-system/components' (the barrel), not from a component folder.",
            },
          ],
        },
      ],
    },
  },
  {
    // The design system itself wraps Radix.
    files: ["design-system/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    // Token helpers are CommonJS so both Node scripts and Tailwind can load them.
    files: ["**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "storybook-static/**", "next-env.d.ts"]),
]);

export default eslintConfig;
