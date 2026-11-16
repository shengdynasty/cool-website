import { footer, site } from "@/content/home";
import { external } from "./markup";
import { SmartLink } from "./SmartLink";

/** Site footer. On subpages it follows the CTA band, so it gets its own seam (`seamed`), as in the source. */
export function SiteFooter({ seamed = false }: { seamed?: boolean }) {
  return (
    <footer className={`night pad end${seamed ? " seamed" : ""}`} id="end">
      {seamed ? <canvas className="seam" data-seam="#000000" aria-hidden="true" /> : null}
      <div className="end-top">
        <p>{footer.tagline}</p>
        <nav aria-label="Footer" className="end-nav">
          {footer.nav.map((link) => (
            <SmartLink key={link.label} data-scramble="true" href={link.href} {...external(link.external)}>
              <span data-label="true">{link.label}</span>
            </SmartLink>
          ))}
        </nav>
      </div>
      <canvas className="mark" id="mark" role="img" aria-label={site.name} />
      <div className="end-legal">
        <span>{footer.legal}</span>
        <span>{footer.handle}</span>
      </div>
    </footer>
  );
}
