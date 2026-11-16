import type { CSSProperties, ReactNode } from "react";
import type { Cover } from "@/content/projects";
import { ArrowRightIcon } from "./icons";
import type { ListItem } from "@/types/listing";
import { external, Words } from "./markup";
import { PostCard } from "./PostCard";
import { SmartLink } from "./SmartLink";

export interface DetailPageProps {
  back: { href: string; label: string; aria: string };
  meta: readonly string[];
  title: string;
  lede: string;
  cover: Cover;
  /** The article body (Callout, Paragraphs, Heading, ...). */
  children: ReactNode;
  contact: {
    heading: string;
    links: { label: string; href: string; primary?: boolean; external?: boolean }[];
    note: string;
  };
  related: ListItem[];
}

const reveal = { "--reveal-delay": "0.2s", "--reveal-y": "12px" } as CSSProperties;

/** The source's guide page: split header (text + cover), a centred reading column, then "Keep reading". */
export function DetailPage({ back, meta, title, lede, cover, children, contact, related }: DetailPageProps) {
  return (
    <>
      <header className="head pad">
        <canvas className="head-code" id="head-code" aria-hidden="true" />
        <div className="head-grid split">
          <div className="head-text">
            <div className="head-meta">
              <SmartLink aria-label={back.aria} href={back.href}>
                ← {back.label}
              </SmartLink>
              {meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <h1 className="head-title" data-head="true" aria-label={title}>
              <Words words={title.split(" ")} />
            </h1>
            <div className="reveal" style={reveal}>
              <p className="head-lede">{lede}</p>
            </div>
          </div>
          <span className={`cover tone-${cover.tone}${cover.fit ? ` fit-${cover.fit}` : ""}`} data-scene={cover.scene}>
            {/* <picture> keeps React from emitting a preload hint, which otherwise rides along with route prefetches
                and downloads every cover onto whichever page links here */}
            <picture>
              <img src={cover.src} width={1200} height={800} alt="" fetchPriority="high" decoding="async" />
            </picture>
            {cover.scene ? <canvas className="iso" aria-hidden="true" /> : null}
            <canvas aria-hidden="true" />
          </span>
        </div>
      </header>
      <div className="sheet">
        <canvas className="seam" data-seam="#F5F2EA" aria-hidden="true" />
        <div className="pad sheet-in">
          <article className="read guide">
            <div>{children}</div>
          </article>
          <section className="read-signup">
            <h2>{contact.heading}</h2>
            <div className="paper-links">
              {contact.links.map((link) => (
                <SmartLink key={link.href} className={link.primary ? "primary" : "secondary"} href={link.href} {...external(link.external)}>
                  {link.label}
                  <ArrowRightIcon size={16} />
                </SmartLink>
              ))}
            </div>
            <p className="paper-note">{contact.note}</p>
          </section>
          <section className="read-more">
            <h2 className="split-title">Keep reading</h2>
            <div className="posts mt-8">
              {related.map((item) => (
                <PostCard key={item.id} href={item.href} cover={item.cover} label={item.category} meta={item.meta} title={item.title} excerpt={item.excerpt} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
