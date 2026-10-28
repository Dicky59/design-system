import clsx, { type ClassValue } from "clsx";

/** Joins class names. No Tailwind conflict resolution on purpose: components expose fixed variants. */
export const cn = (...inputs: ClassValue[]) => clsx(inputs);
