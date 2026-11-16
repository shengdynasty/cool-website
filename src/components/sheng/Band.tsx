import { band } from "@/content/home";
import { ArrowRightIcon } from "./icons";
import { Words } from "./markup";
import { SmartLink } from "./SmartLink";

/** The CTA band that closes every subpage (green in the source, dark grey here). Leads to the home ask card. */
export function Band() {
  return (
    <section id="ask" className="band pad">
      <canvas className="seam" data-seam="#1F1F1F" aria-hidden="true" />
      <canvas className="ask-field" id="ask-field" aria-hidden="true" />
      <div className="band-grid">
        <div>
          <h2 className="h1" data-decrypt="true" aria-label={band.headingAria}>
            <Words words={band.headingWords} />
          </h2>
          <p className="lede">{band.lede}</p>
        </div>
        <div>
          <SmartLink className="band-go" data-scramble="true" href="/#contact">
            <span data-label="true">{band.go}</span>
            <ArrowRightIcon />
          </SmartLink>
          <span className="band-price">{band.price}</span>
        </div>
      </div>
    </section>
  );
}
