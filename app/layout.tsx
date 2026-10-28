import type { Metadata } from "next";
import "../design-system/tokens/tokens.css";
import "./globals.css";
import { themeInitScript } from "./theme/theme";

export const metadata: Metadata = {
  title: "Asiakkaat",
  description: "Asiakashallinta ja laskutus",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The init script sets data-theme before hydration, so the attribute differs from the server HTML on purpose.
    <html lang="fi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
