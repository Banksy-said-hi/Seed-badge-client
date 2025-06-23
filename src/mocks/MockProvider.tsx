"use client";

import { useEffect } from "react";

export function MockProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("./init");
    }
  }, []);

  return <>{children}</>;
}
