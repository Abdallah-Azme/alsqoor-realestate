"use client";

import * as React from "react";
import * as Direction from "@radix-ui/react-direction";

function DirectionProvider({
  dir,
  direction,
  children,
}: {
  dir?: "rtl" | "ltr";
  direction?: "rtl" | "ltr";
  children: React.ReactNode;
}) {
  return (
    <Direction.DirectionProvider dir={direction ?? dir ?? "ltr"}>
      {children}
    </Direction.DirectionProvider>
  );
}

const useDirection = Direction.useDirection;

export { DirectionProvider, useDirection };
