"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const getPathWithSearch = (url) => `${url.pathname}${url.search || ""}`;

export default function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 120);

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    const onDocumentClick = (event) => {
      const anchor = event.target.closest("a[href]");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let nextUrl;
      try {
        nextUrl = new URL(href, window.location.origin);
      } catch {
        return;
      }

      if (nextUrl.origin !== window.location.origin) return;

      const currentPath = getPathWithSearch(window.location);
      const nextPath = getPathWithSearch(nextUrl);
      if (currentPath === nextPath) return;

      setIsLoading(true);
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => {
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-background/65 backdrop-blur-[1px] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

