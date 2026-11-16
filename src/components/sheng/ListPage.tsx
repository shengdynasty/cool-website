import type { CSSProperties } from "react";
import type { ListItem } from "@/types/listing";
import { Words } from "./markup";
import { PostCard } from "./PostCard";

export interface ListPageProps {
  title: string;
  lede: string;
  featuredTitle: string;
  featured: { item: ListItem; label: string }[];
  everyTitle: string;
  categories: readonly string[];
  items: ListItem[];
  gridId: string;
}

const reveal = { "--reveal-delay": "0.2s", "--reveal-y": "12px" } as CSSProperties;

/** The source's /vault page: header with glyph field, a featured row, then a filterable grid. */
export function ListPage({ title, lede, featuredTitle, featured, everyTitle, categories, items, gridId }: ListPageProps) {
  return (
    <>
      <header className="head pad">
        <canvas className="head-code" id="head-code" aria-hidden="true" />
        <div className="head-grid">
          <div className="head-text">
            <h1 className="head-title" data-head="true" aria-label={title}>
              <Words words={title.split(" ")} />
            </h1>
            <div className="reveal" style={reveal}>
              <p className="head-lede">{lede}</p>
            </div>
          </div>
        </div>
      </header>
      <div className="sheet">
        <canvas className="seam" data-seam="#F5F2EA" aria-hidden="true" />
        <div className="pad sheet-in">
          <section>
            <h2 className="split-title">{featuredTitle}</h2>
            <ol className="posts mt-8">
              {featured.map(({ item, label }) => (
                <li key={item.id}>
                  <PostCard href={item.href} cover={item.cover} label={label} meta={item.meta} title={item.title} excerpt={item.excerpt} />
                </li>
              ))}
            </ol>
          </section>
          <section className="read-more">
            <h2 className="split-title">{everyTitle}</h2>
            <div className="filters" data-filter-group={gridId} role="group" aria-label={`Filter ${everyTitle.toLowerCase()}`}>
              {categories.map((category) => (
                <button key={category} type="button" data-filter={category} aria-pressed={category === "All"}>
                  {category}
                </button>
              ))}
            </div>
            <div className="posts" id={gridId}>
              {items.map((item) => (
                <div className="post-wrap enter" data-category={item.category} key={item.id}>
                  <PostCard href={item.href} cover={item.cover} label={item.category} meta={item.meta} title={item.title} excerpt={item.excerpt} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
