import type { ListItem } from "@/types/listing";
import type { Engagement } from "./engagement";
import type { Project } from "./projects";

export const projectHref = (id: string) => `/project/${id}`;
export const engagementHref = (id: string) => `/engagement/${id}`;

export const projectItem = (project: Project): ListItem => ({
  id: project.id,
  href: projectHref(project.id),
  cover: project.cover,
  category: project.category,
  meta: project.technologies.slice(0, 2).join(" · "),
  title: project.title,
  excerpt: project.excerpt,
});

export const engagementItem = (engagement: Engagement): ListItem => ({
  id: engagement.id,
  href: engagementHref(engagement.id),
  cover: engagement.cover,
  category: engagement.category,
  meta: engagement.period,
  title: engagement.title,
  excerpt: engagement.summary,
});

/** The next `count` entries after `index`, wrapping around: the "Keep reading" row. */
export function nextAfter<T>(list: readonly T[], index: number, count = 3): T[] {
  return Array.from({ length: Math.min(count, list.length - 1) }, (_, k) => list[(index + 1 + k) % list.length]);
}

/** "Video-to-Text MCP Server" → "Video-to-Text"; used in "Questions about …?" lines. */
export const shortTitle = (title: string) => title.split(/ — | v\d| MCP Server| Server$/)[0].trim();
