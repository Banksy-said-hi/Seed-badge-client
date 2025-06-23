import React from "react";
import "../globals.css";
import { MockProvider } from "../mocks/MockProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MockProvider>{children}</MockProvider>
      </body>
    </html>
  );
}
