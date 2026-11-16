import type { ReactNode } from "react";
import { jetbrainsMono } from "@/lib/fonts";
import { Band } from "./Band";
import { SiteBar } from "./SiteBar";
import { SiteFooter } from "./SiteFooter";
import { SubpageMotion } from "./SubpageMotion";

/** Chrome shared by the list and detail pages: progress bar, nav, CTA band, footer, effects. */
export function Subpage({ active, children }: { active?: string; children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteBar active={active} />
      <main id="main">
        {children}
        <Band />
      </main>
      <SiteFooter seamed />
      <SubpageMotion mono={jetbrainsMono.style.fontFamily} />
    </>
  );
}
