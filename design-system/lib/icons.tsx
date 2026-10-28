import type { SVGProps } from "react";

// Decorative icons for use inside design system components. Always hidden from assistive tech;
// the surrounding component provides the accessible name.
type IconProps = Omit<SVGProps<SVGSVGElement>, "className" | "style" | "children">;

function Svg(props: IconProps & { path: string; spin?: boolean }) {
  const { path, spin, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={spin ? "h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" : "h-4 w-4 shrink-0"}
      {...rest}
    >
      <path d={path} />
    </svg>
  );
}

export const IconX = (p: IconProps) => <Svg path="M18 6 6 18M6 6l12 12" {...p} />;
export const IconCheck = (p: IconProps) => <Svg path="M20 6 9 17l-5-5" {...p} />;
export const IconChevronDown = (p: IconProps) => <Svg path="m6 9 6 6 6-6" {...p} />;
export const IconArrowUp = (p: IconProps) => <Svg path="M12 19V5M5 12l7-7 7 7" {...p} />;
export const IconArrowDown = (p: IconProps) => <Svg path="M12 5v14M19 12l-7 7-7-7" {...p} />;
export const IconInfo = (p: IconProps) => <Svg path="M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" {...p} />;
export const IconSuccess = (p: IconProps) => <Svg path="m9 12 2 2 4-4M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" {...p} />;
export const IconWarning = (p: IconProps) => (
  <Svg path="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" {...p} />
);
export const IconError = (p: IconProps) => <Svg path="m15 9-6 6M9 9l6 6M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" {...p} />;

/** Spinner for loading states. Rotation is disabled for users who prefer reduced motion. */
export const IconSpinner = (p: IconProps) => (
  <Svg path="M21 12a9 9 0 1 1-6.2-8.6" spin {...p} />
);
