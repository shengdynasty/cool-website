/* eslint-disable @next/next/no-img-element -- a canvas sits over each cover and dissolves on scroll; plain <img> matches the source */
import type { Cover } from "@/content/projects";
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
      <span className={`cover tone-${cover.tone}${cover.fit ? ` fit-${cover.fit}` : ""}`}>
        <img src={cover.src} width={1200} height={800} alt="" loading="lazy" decoding="async" />
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
