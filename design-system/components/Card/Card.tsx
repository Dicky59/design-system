import { createElement, forwardRef, type ReactNode } from "react";
import type { NativeProps } from "../../lib/styles";

export interface CardProps extends NativeProps<"div"> {
  children: ReactNode;
}

/**
 * Bordered surface that groups related content. Compose with CardHeader, CardTitle,
 * CardContent and CardFooter.
 * @a11y A Card is a plain container. Give it a CardTitle so the group has a heading.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ children, ...rest }, ref) {
  return (
    <div ref={ref} className="rounded-lg border border-border bg-surface text-content shadow-sm" {...rest}>
      {children}
    </div>
  );
});

export interface CardHeaderProps extends NativeProps<"div"> {
  children: ReactNode;
}

/** Top section of a Card. Usually holds a CardTitle and optionally a Badge or Button on the right. */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader({ children, ...rest }, ref) {
  return (
    <div ref={ref} className="flex items-center justify-between gap-4 border-b border-border px-6 py-4" {...rest}>
      {children}
    </div>
  );
});

export interface CardTitleProps extends NativeProps<"h2"> {
  /**
   * Heading level. Choose the level that continues the page outline without skipping levels.
   * @a11y Required: the design system cannot know where the Card sits in the page structure.
   */
  level: 2 | 3 | 4;
  children: ReactNode;
}

/** Heading of a Card. */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { level, children, ...rest },
  ref,
) {
  return createElement(`h${level}`, { ref, className: "text-lg font-semibold text-content", ...rest }, children);
});

export interface CardContentProps extends NativeProps<"div"> {
  children: ReactNode;
}

/** Main body of a Card. */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className="p-6" {...rest}>
      {children}
    </div>
  );
});

export interface CardFooterProps extends NativeProps<"div"> {
  children: ReactNode;
}

/** Bottom section of a Card for actions, right-aligned. */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter({ children, ...rest }, ref) {
  return (
    <div ref={ref} className="flex items-center justify-end gap-3 border-t border-border px-6 py-4" {...rest}>
      {children}
    </div>
  );
});
