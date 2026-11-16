"use client";

import { useEffect, useLayoutEffect } from "react";
import { createHeroNote, postNote, scrollToTopAfterNavigation } from "./contact";
import { HeroEngine } from "./hero-engine";
import { initExperience, wireContactLinks } from "./home-extras";
import { initRestEffects } from "./rest-effects";
import { footer, hero } from "@/content/home";

/**
 * Wires the hero engine, the note flow, the below-the-hero effects, the experience accordion and
 * the contact links to the server-rendered markup. Mirrors the source site's HomeMotion, which also renders nothing.
 */
export function HomeMotion({ mono }: { mono: string }) {
  useLayoutEffect(() => {
    document.querySelector(".home")?.classList.add("js");
    scrollToTopAfterNavigation();
  }, []);

  useEffect(() => {
    const home = document.querySelector<HTMLElement>(".home");
    const heroEl = home?.querySelector<HTMLElement>(".hero");
    const restEl = home?.querySelector<HTMLElement>(".rest");
    if (!home || !heroEl || !restEl) return;

    const note = createHeroNote(heroEl, postNote);
    const engine = new HeroEngine(heroEl, {
      mono,
      gridUrl: "/home/hero-grid.json",
      examples: hero.card.examples,
      sentNote: hero.card.sent,
      onIdeaSent: note.onIdeaSent,
    });
    engine.start();
    const disposeRest = initRestEffects(restEl, mono, { markText: footer.mark });
    const disposeExperience = initExperience(home);
    const disposeContact = wireContactLinks(document.body, "#idea-code");

    return () => {
      engine.destroy();
      note.dispose();
      disposeRest();
      disposeExperience();
      disposeContact();
    };
  }, [mono]);

  return null;
}
