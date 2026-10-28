import { forwardRef, type ReactNode } from "react";
import type { NativeProps } from "../../lib/styles";

export interface PageProps extends NativeProps<"main"> {
  /** A PageHeader followed by the page's sections. */
  children: ReactNode;
}

/**
 * Page container: the `main` landmark with responsive padding, a centered maximum width and a gap between sections.
 * @a11y Renders the page's single `main` landmark. Use exactly one per page.
 */
export const Page = forwardRef<HTMLElement, PageProps>(function Page({ children, ...rest }, ref) {
  return (
    <main ref={ref} className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8" {...rest}>
      {children}
    </main>
  );
});
