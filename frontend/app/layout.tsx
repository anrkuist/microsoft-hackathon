"use client";

import type { Metadata } from "next";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
      </body>
    </html>
  );
}
