import type { CSSProperties } from "react";
import { jetbrainsMono } from "@/lib/fonts";
import { ExperienceSection } from "@/components/sheng/ExperienceSection";
import { Hero } from "@/components/sheng/Hero";
import { HomeMotion } from "@/components/sheng/HomeMotion";
import { ProjectsSection } from "@/components/sheng/ProjectsSection";
import { Sheet } from "@/components/sheng/Sheet";
import { SiteFooter } from "@/components/sheng/SiteFooter";
import { StatusSection } from "@/components/sheng/StatusSection";

const MONO = jetbrainsMono.style.fontFamily;
const homeStyle = { "--mono": MONO } as CSSProperties;

// Same trick as the source: mark .home as JS-enabled while the HTML is still parsing,
// so the scramble-in texts are hidden from the first paint instead of flashing.
const MARK_JS = 'document.currentScript.parentElement.classList.add("js")';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <main id="main">
        <div className="home" style={homeStyle} suppressHydrationWarning>
          <script dangerouslySetInnerHTML={{ __html: MARK_JS }} />
          <Hero />
          <div className="rest">
            <StatusSection mono={MONO} />
            <ExperienceSection />
            <Sheet />
            <ProjectsSection />
            <SiteFooter />
          </div>
          <HomeMotion mono={MONO} />
        </div>
      </main>
    </>
  );
}
