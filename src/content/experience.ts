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
/** Photos (resized) for the three with real photos, the portfolio's own illustrations for the rest. */
const PHOTO_BACKGROUNDS = new Set(["mailzoo", "wharton-investment", "nasa-dream-with-us"]);

const firstSentence = (text: string): string => text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;

export const experiences: Experience[] = engagements.map((e) => ({
  id: e.id,
  name: NAMES[e.id] ?? e.title,
  when: e.period,
  role: `${e.role} · ${e.commitment}`,
  blurb: firstSentence(e.summary),
  href: `/engagement/${e.id}`,
  background: `/images/experience/${e.id}-bg.${PHOTO_BACKGROUNDS.has(e.id) ? "jpg" : "svg"}`,
  logo: `/images/experience/${e.id}-logo.png`,
}));
