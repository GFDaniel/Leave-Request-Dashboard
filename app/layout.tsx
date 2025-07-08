import type React from "react";
import { ThemeProvider } from "@ui5/webcomponents-react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Leave Request Dashboard</title>
        <meta
          name="description"
          content="SAP UI5 + React Leave Request Management System"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
