/* eslint-disable @next/next/no-img-element -- the stage stacks two canvases over these exact pixels; plain <img> keeps the source's absolute layout */
import { hero, nav, site } from "@/content/home";
import { ArrowRightIcon } from "./icons";
import { external } from "./markup";
import { SmartLink } from "./SmartLink";

export function Hero() {
  const { card, status } = hero;
  return (
    <div className="hero">
      <div className="stage">
        <img src="/home/hero-photo.webp" width={2400} height={1500} alt={hero.photoAlt} fetchPriority="high" decoding="async" />
        <img id="hero-poster" src="/home/hero-code.webp" width={2400} height={1500} alt="" fetchPriority="high" decoding="async" />
        <canvas id="hero-code" aria-hidden="true" />
        <canvas id="hero-art" aria-hidden="true" />
        <div className="shade" aria-hidden="true" />
        <div id="hero-curtain" aria-hidden="true" />
      </div>

      <header className="bar">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- the engine intercepts this click to replay the intro */}
        <a href="/" id="hero-replay" className="logo">
          <span aria-hidden="true" />
          {site.wordmark}
        </a>
        <div className="bar-links">
          <nav className="navlinks" aria-label="Main">
            {nav.map((link) => (
              <SmartLink key={link.t} aria-label={link.aria} data-t={link.t} data-hover="300" href={link.href} {...external(link.external)}>
                {link.label}
              </SmartLink>
            ))}
          </nav>
          <a href="#contact" className="work" data-t="work" data-hover="300">
            {hero.work}
          </a>
        </div>
      </header>

      <div className="main">
        <h1 className="title" aria-label={hero.title}>
          <span aria-hidden="true">
            <span data-t="l2">{hero.title}</span>
            <span className="caret" id="hero-caret" />
          </span>
        </h1>
        <p className="rise sub">{hero.sub}</p>

        <div className="deck" id="hero-deck">
          <div className="ground" aria-hidden="true" />
          <div className="lift" id="contact">
            {/* Without JS this still works: GET to a mailto: URL becomes ?subject=…&body=… */}
            <form id="hero-form" className="card space" action={`mailto:${site.email}`} method="get">
              <input type="hidden" name="subject" value={hero.mailSubject} />
              <div className="sheen" aria-hidden="true" />
              <div className="rim" aria-hidden="true" />
              <label htmlFor="idea-code" className="ask-label">
                {card.label}
              </label>
              <div className="well">
                <span aria-hidden="true" className="prompt">
                  &gt;
                </span>
                <input id="idea-code" name="body" type="text" autoComplete="off" placeholder={card.examples[0]} />
              </div>
              <label htmlFor="idea-email" className="sr-only">
                Your email
              </label>
              <div className="well">
                <span aria-hidden="true" className="prompt">
                  @
                </span>
                <input id="idea-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder={card.emailPlaceholder} />
              </div>
              <button type="submit" className="go" id="hero-go" data-hover="380" data-key="go">
                <span data-t="go">{card.go}</span>
                <ArrowRightIcon />
              </button>
              <div className="foot">
                <span className="price" data-t="price">
                  {card.price}
                </span>
                <span className="note" data-t="note">
                  {card.note}
                </span>
              </div>
              <p className="idea-status" id="idea-status" role="status" aria-live="polite" />
            </form>
          </div>
        </div>
      </div>

      <footer className="status">
        <span data-t="reply">{status.reply}</span>
        <span className="statusright">
          <span data-t="videos">{status.videos}</span>
          <span data-t="followers">{status.followers}</span>
          <span data-t="guides">{status.guides}</span>
        </span>
      </footer>
    </div>
  );
}
