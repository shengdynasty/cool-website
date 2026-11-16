import { hero, nav, site } from "@/content/home";
import { external } from "./markup";
import { SmartLink } from "./SmartLink";

/** Subpage nav (the home page has its own inside the hero, wired to the hero engine). */
export function SiteBar({ active }: { active?: string }) {
  return (
    <header className="bar">
      <SmartLink className="logo" href="/">
        <span aria-hidden="true" />
        {site.wordmark}
      </SmartLink>
      <div className="bar-links">
        <nav className="navlinks" aria-label="Main">
          {nav.map((link) => (
            <SmartLink
              key={link.t}
              href={link.href}
              aria-label={link.aria}
              aria-current={active && link.href === active ? "page" : undefined}
              data-scramble="true"
              {...external(link.external)}
            >
              <span data-label="true">{link.label}</span>
            </SmartLink>
          ))}
        </nav>
        <SmartLink className="work" data-scramble="true" href="/#contact">
          <span data-label="true">{hero.work}</span>
        </SmartLink>
      </div>
    </header>
  );
}
