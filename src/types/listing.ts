import type { Cover } from "@/content/projects";

/** One card in a list or "Keep reading" row. */
export interface ListItem {
  id: string;
  href: string;
  cover: Cover;
  category: string;
  meta: string;
  title: string;
  excerpt: string;
}
