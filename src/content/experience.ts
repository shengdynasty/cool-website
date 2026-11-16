// Experience accordion on the home page (design from aumsuthar.com's experience section).
// Rows come from the generated engagement data, so the copy stays the portfolio's own.
import { engagements } from "./engagement";

export interface Experience {
  id: string;
  /** Short display name on the panel ("K2 Space" in the source design). */
  name: string;
  when: string;
  role: string;
  /** The first sentence of the engagement summary. */
  blurb: string;
  href: string;
  background: string;
  logo: string;
}

const NAMES: Record<string, string> = {
  mailzoo: "MailZoo",
  "yc-startup-school": "Y Combinator",
  "wharton-investment": "Wharton",
  econometrics: "Cornell",
  "nasa-dream-with-us": "NASA",
  "iit-research": "IIT",
  robotics: "Fox Valley Robotics",
  "math-competition": "Math Team",
};
/** Every panel has a photo (scripts/build-covers.mjs, scripts/build-experience-assets.mjs) except YC, which keeps its illustration. */
const SVG_BACKGROUNDS = new Set(["yc-startup-school"]);

const firstSentence = (text: string): string => text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;

export const experiences: Experience[] = engagements.map((e) => ({
  id: e.id,
  name: NAMES[e.id] ?? e.title,
  when: e.period,
  role: `${e.role} · ${e.commitment}`,
  blurb: firstSentence(e.summary),
  href: `/engagement/${e.id}`,
  background: `/images/experience/${e.id}-bg.${SVG_BACKGROUNDS.has(e.id) ? "svg" : "jpg"}`,
  logo: `/images/experience/${e.id}-logo.png`,
}));
