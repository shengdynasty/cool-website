import type { Metadata } from "next";
import covers from "@/content/covers.json";
import { engagements } from "@/content/engagement";
import { projects } from "@/content/projects";
import { SITE_URL } from "@/content/seo";
import { Subpage } from "@/components/sheng/Subpage";
import { SmartLink } from "@/components/sheng/SmartLink";

export const metadata: Metadata = {
  title: "Photo credits — Sheng Yan",
  description: "Sources and licenses for the photographs used on sheng-yan.com.",
  alternates: { canonical: `${SITE_URL}/credits/` },
  robots: { index: false, follow: true },
};

const nameOf = (id: string) => projects.find((p) => p.id === id)?.title ?? engagements.find((e) => e.id === id)?.title ?? id;

/** Where each photograph came from. The project covers are the photos re-rendered in the site's three-tone palette. */
export default function CreditsPage() {
  const groups = [
    // the site's own stills (`own`) are rendered the same way but need no credit
    { heading: "Project covers", items: covers.filter((c) => c.kind === "project" && !("own" in c && c.own)) },
    { heading: "Experience panels", items: covers.filter((c) => c.kind === "experience") },
  ];
  return (
    <Subpage>
      <header className="head pad">
        <canvas className="head-code" id="head-code" aria-hidden="true" />
        <div className="head-grid">
          <div className="head-text">
            <div className="head-meta">
              <span>Credits</span>
            </div>
            <h1 className="head-title">Photo credits</h1>
            <p className="head-lede">
              The project covers are photographs re-rendered in this site&apos;s palette. Every photo is public domain, CC0, or CC BY, and is listed
              here with its source. The MailZoo, Wharton and NASA panels, and the Project Reelix cover (a frame of its own video), are the
              site&apos;s own.
            </p>
          </div>
        </div>
      </header>
      <main id="main" className="sheet-in">
        <section className="pad read">
          {groups.map((group) => (
            <div key={group.heading}>
              <h2 className="t-h3">{group.heading}</h2>
              <ul className="credits">
                {group.items.map((c) => (
                  <li key={c.id}>
                    <b>{nameOf(("for" in c && c.for) || c.id)}</b>
                    <span>
                      {c.page ? (
                        <SmartLink href={c.page}>{c.title}</SmartLink>
                      ) : (
                        c.title
                      )}
                      {c.author ? ` by ${c.author}` : ""}, {c.license}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
    </Subpage>
  );
}
