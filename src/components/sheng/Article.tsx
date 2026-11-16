/* eslint-disable @next/next/no-img-element -- figures reuse the cover frame (canvas overlay), plain <img> like the source */
import type { ReactNode } from "react";
import type { Cover } from "@/content/projects";

// Article blocks for the detail pages, with the source guide page's exact utility classes
// (callout, paragraph, link list, h2, copyable code block), recoloured through the theme tokens.

export function Callout({ children }: { children: ReactNode }) {
  return <div className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 leading-[1.7] text-ink">{children}</div>;
}

export function Paragraphs({ items }: { items: readonly string[] }) {
  return (
    <>
      {items.map((text, i) => (
        <p key={i} className="mt-5 text-lg leading-[1.75] text-ink">
          {text}
        </p>
      ))}
    </>
  );
}

export function Heading({ children }: { children: ReactNode }) {
  return <h2 className="mt-12 t-h3 text-ink">{children}</h2>;
}

export interface LinkRow {
  title: string;
  note: string;
  href: string;
  external?: boolean;
}

/** Reference rows (title + note + arrow) between hairlines. */
export function LinkList({ links }: { links: readonly LinkRow[] }) {
  if (!links.length) return null;
  return (
    <ul className="mt-5 divide-y divide-line border-y border-line">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            className="group flex items-start gap-4 py-3.5"
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink transition-colors group-hover:text-accent">{link.title}</span>
              <span className="mt-0.5 block text-[15px] leading-[1.6] break-words text-ink-soft">{link.note}</span>
            </span>
            <span aria-hidden="true" className="mt-0.5 text-ink-dim transition-colors group-hover:text-accent">
              {link.external ? "↗" : "→"}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Plain rows between hairlines (the link list's layout without links), for feature lists. */
export function RowList({ items }: { items: readonly string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-5 divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <li key={i} className="py-3.5 text-[17px] leading-[1.6] text-ink">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CodeBlock({ id, label, source }: { id: string; label: string; source: string }) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="font-mono text-[12px] text-accent">{label}</span>
        <button
          type="button"
          data-copy={id}
          className="rounded-xl border border-line-strong bg-bg-raise px-3 py-1.5 font-mono text-[12px] text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          <span aria-live="polite">Copy</span>
        </button>
      </div>
      <pre
        tabIndex={0}
        className="overflow-x-auto rounded-xl bg-[#0A0A0A] p-5 font-mono text-[13px] leading-[1.7] whitespace-pre-wrap break-words text-[#E5E5E5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <code id={id}>{source}</code>
      </pre>
    </div>
  );
}

export function Figure({ src, tone, title, caption }: Cover & { title: string; caption: string }) {
  return (
    <figure>
      <span className={`cover tone-${tone}`}>
        <img src={src} width={1200} height={800} alt={title} loading="lazy" decoding="async" />
        <canvas aria-hidden="true" />
      </span>
      <figcaption>
        <b>{title}</b>
        {caption}
      </figcaption>
    </figure>
  );
}
