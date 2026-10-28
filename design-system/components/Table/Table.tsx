import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { IconArrowDown, IconArrowUp } from "../../lib/icons";
import { focusRing, type NativeProps } from "../../lib/styles";

export interface TableProps extends NativeProps<"table"> {
  /**
   * Short title that describes the table, in Finnish, e.g. "Asiakkaat".
   * @a11y Required: it is the accessible name of the table; the scroll region is named "<caption>, vieritettävä".
   */
  caption: string;
  /**
   * Hide the caption visually (it stays available to screen readers). Use when a heading above already shows it.
   * @default false
   */
  captionHidden?: boolean;
  /** TableHeader and TableBody. */
  children: ReactNode;
}

/**
 * Data table. Compose with TableHeader, TableBody, TableRow, TableHead, TableCell and TableEmpty.
 * Scrolls horizontally on narrow screens; the scroll wrapper is a keyboard focusable `region` labelled
 * "<caption>, vieritettävä".
 * @a11y Caption is required. Use TableHead (scope="col") for column headings and TableCell rowHeader for row headings.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { caption, captionHidden = false, children, ...rest },
  ref,
) {
  return (
    <div
      role="region"
      aria-label={`${caption}, vieritettävä`}
      tabIndex={0}
      className={cn("overflow-x-auto rounded-lg border border-border bg-surface", focusRing)}
    >
      <table ref={ref} className="w-full border-collapse text-left text-sm text-content" {...rest}>
        <caption
          className={captionHidden ? "sr-only" : "px-4 py-3 text-left text-base font-semibold text-content"}
        >
          {caption}
        </caption>
        {children}
      </table>
    </div>
  );
});

export interface TableHeaderProps extends NativeProps<"thead"> {
  children: ReactNode;
}

/** Header group (`thead`). Contains one TableRow of TableHead cells. */
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { children, ...rest },
  ref,
) {
  return (
    <thead ref={ref} className="border-b border-border bg-surface-muted" {...rest}>
      {children}
    </thead>
  );
});

export interface TableBodyProps extends NativeProps<"tbody"> {
  children: ReactNode;
}

/** Body group (`tbody`). Contains TableRow elements, or a TableEmpty row when there is no data. */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { children, ...rest },
  ref,
) {
  return (
    <tbody ref={ref} className="divide-y divide-border" {...rest}>
      {children}
    </tbody>
  );
});

export interface TableRowProps extends NativeProps<"tr"> {
  children: ReactNode;
}

/** Table row. Highlights on hover. */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ children, ...rest }, ref) {
  return (
    <tr ref={ref} className="hover:bg-surface-muted" {...rest}>
      {children}
    </tr>
  );
});

export interface TableHeadProps extends Omit<NativeProps<"th">, "scope" | "onClick"> {
  /** Right-align the column; use for amounts and counts. */
  numeric?: boolean;
  /**
   * Current sort state of this column. Omit for columns that cannot be sorted.
   * @a11y Rendered as `aria-sort`, together with an arrow icon.
   */
  sortDirection?: "ascending" | "descending" | "none";
  /** Called when the user activates the column heading. Makes the heading a button. */
  onSort?: () => void;
  children: ReactNode;
}

/** Column heading (`th scope="col"`), optionally sortable. */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { numeric = false, sortDirection, onSort, children, ...rest },
  ref,
) {
  return (
    <th
      ref={ref}
      scope="col"
      aria-sort={onSort ? (sortDirection ?? "none") : undefined}
      className={cn("px-4 py-3 text-sm font-semibold text-content", numeric ? "text-right" : "text-left")}
      {...rest}
    >
      {onSort ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "inline-flex items-center gap-1 rounded-sm font-semibold hover:text-primary-subtle-text",
            numeric && "flex-row-reverse",
            focusRing,
          )}
        >
          {children}
          {sortDirection === "ascending" ? <IconArrowUp /> : null}
          {sortDirection === "descending" ? <IconArrowDown /> : null}
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export interface TableCellProps extends Omit<NativeProps<"td">, "scope"> {
  /** Right-align with tabular figures; use for amounts, dates and counts. */
  numeric?: boolean;
  /** Render as a row heading (`th scope="row"`), e.g. the customer name column. */
  rowHeader?: boolean;
  children?: ReactNode;
}

/** Data cell (`td`), or row heading when `rowHeader` is set. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { numeric = false, rowHeader = false, children, ...rest },
  ref,
) {
  const className = cn("px-4 py-3", numeric ? "text-right tabular-nums" : "text-left", rowHeader && "font-medium");
  return rowHeader ? (
    <th ref={ref} scope="row" className={className} {...rest}>
      {children}
    </th>
  ) : (
    <td ref={ref} className={className} {...rest}>
      {children}
    </td>
  );
});

export interface TableEmptyProps {
  /** Number of columns in the table, so the message spans the full width. */
  colSpan: number;
  /** Finnish message, e.g. "Ei asiakkaita." Say what to do next when possible. */
  children: ReactNode;
}

/** Row shown inside TableBody when there is no data. */
export function TableEmpty({ colSpan, children }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-content-muted">
        {children}
      </td>
    </tr>
  );
}
