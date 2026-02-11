"use client";

import { useState, useEffect } from "react";

export type Direction = "ltr" | "rtl";

/**
 * Hook to detect and react to document direction changes.
 * Returns the current direction based on the document's dir attribute.
 * This enables Radix UI components and other RTL-aware components to
 * automatically adjust their layout based on the current locale.
 */
export function useDirection(): Direction {
  const [dir, setDir] = useState<Direction>("ltr");

  useEffect(() => {
    // Get initial direction from document or body
    const getDirection = (): Direction => {
      const docDir = document.documentElement.dir || document.body.dir;
      return docDir === "rtl" ? "rtl" : "ltr";
    };

    setDir(getDirection());

    // Observe changes to dir attribute on html and body
    const observer = new MutationObserver(() => {
      setDir(getDirection());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => observer.disconnect();
  }, []);

  return dir;
}

export default useDirection;
