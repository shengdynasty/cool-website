/* eslint-disable @next/next/no-img-element -- absolutely positioned panel art, like the source design */
import { experiences } from "@/content/experience";
import { experience } from "@/content/home";
import { Words } from "./markup";
import { SmartLink } from "./SmartLink";

/**
 * Experience accordion, after aumsuthar.com: a row of tall panels, each a blurred photo with a
 * white logo badge and a vertical label; the selected one grows 7×, sharpens, and shows its details.
 * Motion (home-extras.ts): the panels rise in when the row scrolls into view, an opening panel's photo develops
 * out of a glyph field drawn on its canvas, and the row advances by itself with the countdown line until clicked.
 */
export function ExperienceSection() {
  return (
    <section id="experience" className="pad xp-section">
      <canvas className="seam" data-seam="#141414" aria-hidden="true" />
      <h2 className="h2" data-decrypt="true" aria-label={experience.headingAria}>
        <Words words={experience.headingWords} />
      </h2>
      <div className="xp-row" role="tablist" aria-label="Experience" data-experience="true">
        {experiences.map((item, i) => (
          <div
            key={item.id}
            className="xp"
            role="tab"
            aria-selected={i === 0}
            aria-controls={`xp-${item.id}`}
            tabIndex={i === 0 ? 0 : -1}
          >
            <img className="xp-bg" src={item.background} alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" />
            <canvas className="xp-dev" aria-hidden="true" hidden />
            <span className="xp-badge" aria-hidden="true">
              <img src={item.logo} alt="" width={64} height={64} loading="lazy" decoding="async" />
            </span>
            <span className="xp-tag" aria-hidden="true">
              {item.name}
            </span>
            <div className="xp-info" id={`xp-${item.id}`} role="tabpanel">
              <div className="xp-box">
                <div className="xp-head">
                  <h3 className="xp-name">{item.name}</h3>
                  <span className="xp-when">{item.when}</span>
                </div>
                <p className="xp-role">{item.role}</p>
                <p className="xp-blurb">{item.blurb}</p>
                <SmartLink className="xp-more" href={item.href}>
                  Read the write-up →
                </SmartLink>
              </div>
            </div>
            <span className="xp-timer" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}
