/* eslint-disable @next/next/no-img-element -- a canvas sits over each cover and dissolves on scroll; plain <img> matches the source */
// A cover with a `scene` also gets a `canvas.iso`: the animated isometric scene (iso-engine.ts) plays over the still.
// A cover with a `video` gets its muted loop over the still (LoopClip), played while the card is in view.
import type { Cover } from "@/content/projects";
import { LoopClip } from "./LoopClip";
import { SmartLink } from "./SmartLink";

export interface PostCardProps {
  href: string;
  cover: Cover;
  label: string;
  meta: string;
  title: string;
  excerpt: string;
}

/** One card in a posts grid (the source vault's `.post`). */
export function PostCard({ href, cover, label, meta, title, excerpt }: PostCardProps) {
  return (
    <SmartLink className="post" href={href}>
      <span className={`cover tone-${cover.tone}${cover.fit ? ` fit-${cover.fit}` : ""}`} data-scene={cover.scene}>
        <img src={cover.src} width={1200} height={800} alt="" loading="lazy" decoding="async" />
        {cover.video ? <LoopClip poster={cover.src} mp4={cover.video} webm={cover.webm} /> : null}
        {cover.scene ? <canvas className="iso" aria-hidden="true" /> : null}
        <canvas aria-hidden="true" />
      </span>
      <span className="post-meta">
        <b>{label}</b>
        <span>{meta}</span>
      </span>
      <h3 className="post-title">{title}</h3>
      <p className="post-excerpt line-clamp-3">{excerpt}</p>
    </SmartLink>
  );
}
