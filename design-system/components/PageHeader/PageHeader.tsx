import { forwardRef, type ReactNode } from "react";
import type { NativeProps } from "../../lib/styles";

export interface PageHeaderProps extends Omit<NativeProps<"header">, "title"> {
  /**
   * Page title in Finnish. Rendered as the page's only `h1`.
   * @a11y Required: every page has exactly one h1.
   */
  title: string;
  /** Page-level actions on the right, usually one primary Button. They wrap below the title on narrow screens. */
  children?: ReactNode;
}

/**
 * Top of a page: the `h1` title and optional page-level actions.
 * @a11y Renders the only `h1` of the page. Do not use more than one PageHeader per page.
 */
export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  { title, children, ...rest },
  ref,
) {
  return (
    <header ref={ref} className="flex flex-wrap items-center justify-between gap-4" {...rest}>
      <h1 className="text-2xl font-bold text-content">{title}</h1>
      {children}
    </header>
  );
});
