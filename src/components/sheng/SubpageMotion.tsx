"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { scrollToTopAfterNavigation } from "./contact";
import { initRestEffects } from "./rest-effects";
import { initSubpageEffects } from "./subpage-effects";
import { footer } from "@/content/home";

/** Subpage counterpart of HomeMotion (the source's SiteMotion: the shared effects over the whole body). */
export function SubpageMotion({ mono }: { mono: string }) {
  const pathname = usePathname();
  useLayoutEffect(() => {
    scrollToTopAfterNavigation();
  }, [pathname]);
  useEffect(() => {
    const disposeRest = initRestEffects(document.body, mono, { markText: footer.mark });
    const disposeSubpage = initSubpageEffects(document.body);
    return () => {
      disposeRest();
      disposeSubpage();
    };
  }, [mono, pathname]);
  return null;
}
