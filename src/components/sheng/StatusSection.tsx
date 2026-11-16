import { status } from "@/content/home";
import { ArrowRightIcon } from "./icons";
import { MailZooLogo } from "./MailZooLogo";
import { external, Words } from "./markup";
import { PortraitMark } from "./PortraitMark";

/** Source: the "ultrastack" newsletter section. Here: what Sheng is building now, with the ASCII portrait. */
export function StatusSection({ mono }: { mono: string }) {
  return (
    <section id="ultrastack" className="night pad ultra-home">
      <div className="ultra-home-grid">
        <div>
          <PortraitMark src="/home/portrait-cutout.webp" fallbackSrc="/home/portrait.webp" alt={status.portraitAlt} mono={mono} />
          <h2 className="h2" data-decrypt="true" aria-label={status.headingAria}>
            <Words words={status.headingWords} accent={status.headingAccent} />
          </h2>
          <p className="lede">{status.lede}</p>
          <a className="mz-link" href={status.mailzoo.href} target="_blank" rel="noopener" aria-label="MailZoo website (opens in a new tab)">
            <MailZooLogo />
            <span>{status.mailzoo.label}</span>
          </a>
        </div>
        <div>
          <dl className="ultra-parts">
            {status.items.map((item) => (
              <div key={item.term}>
                <dt>{item.term}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>
          <div className="ultra-home-form">
            <div className="links-row">
              {status.links.map((link) => (
                <a key={link.label} href={link.href} data-scramble="true" {...external(link.external)}>
                  <span data-label="true">{link.label}</span>
                  <ArrowRightIcon size={16} />
                </a>
              ))}
            </div>
            <p className="links-note">{status.linksNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
