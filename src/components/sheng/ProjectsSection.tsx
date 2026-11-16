/* eslint-disable @next/next/no-img-element -- each cover has a canvas laid over it that dissolves on scroll; plain <img> matches the source */
import { projects } from "@/content/home";
import { ArrowRightIcon } from "./icons";
import { external, Words } from "./markup";
import { SmartLink } from "./SmartLink";

/** Source: "Free guides from the videos". Here: project write-ups from the portfolio. */
export function ProjectsSection() {
  const { lead, rows, more } = projects;
  return (
    <section id="guides" className="night pad guides">
      <canvas className="seam" data-seam="#000000" aria-hidden="true" />
      <div className="guides-head">
        <div>
          <h2 className="h2" data-decrypt="true" aria-label={projects.headingAria}>
            <Words words={projects.headingWords} />
          </h2>
        </div>
        <SmartLink className="ghost" data-scramble="true" href={projects.all.href}>
          <span data-label="true">{projects.all.label}</span>
          <ArrowRightIcon size={16} />
        </SmartLink>
      </div>

      <div className="guides-list">
        <SmartLink className="lead" href={lead.href}>
          <span className="cover tone-original">
            <img src={lead.cover} width={1200} height={800} alt="" loading="lazy" decoding="async" />
            <canvas aria-hidden="true" />
          </span>
          <span className="g-title">{lead.title}</span>
          <span className="g-time">{lead.meta}</span>
        </SmartLink>
        <div className="rows">
          {rows.map((row) => (
            <SmartLink className="row" href={row.href} key={row.href}>
              <span className="cover tone-original">
                <img src={row.cover} width={300} height={200} alt="" loading="lazy" decoding="async" />
                <canvas aria-hidden="true" />
              </span>
              <span className="row-text">
                <span className="g-title">{row.title}</span>
                <span className="g-time">{row.meta}</span>
              </span>
            </SmartLink>
          ))}
        </div>
      </div>

      <div className="guides-signup">
        <p>{more.text}</p>
        <div>
          <div className="links-row">
            {more.links.map((link) => (
              <SmartLink key={link.label} href={link.href} data-scramble="true" {...external(link.external)}>
                <span data-label="true">{link.label}</span>
                <ArrowRightIcon size={16} />
              </SmartLink>
            ))}
          </div>
          <p className="links-note">{more.note}</p>
        </div>
      </div>
    </section>
  );
}
