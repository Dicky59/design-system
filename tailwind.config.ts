import type { Config } from "tailwindcss";
import tokenTheme from "./design-system/tokens/tailwind-theme.cjs";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./design-system/**/*.{ts,tsx}"],
  // The JS theme is plain data; its inferred array types are wider than Tailwind's tuples.
  theme: tokenTheme as unknown as Config["theme"],
  plugins: [],
};

export default config;
