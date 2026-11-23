"use client";

import type { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function FooterVisibility({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showFooter =
    pathname === "/search"
      ? Boolean(searchParams.get("query")?.trim())
      : pathname === "/" ||
        pathname.startsWith("/movies/") ||
        pathname === "/mypage";

  return showFooter ? <>{children}</> : null;
}