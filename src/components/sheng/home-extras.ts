/**
 * Home-page extras, framework-free so the static artifact build can run them:
 * - the experience accordion (aumsuthar.com's design: a row of panels, the selected one grows 7×)
 * - "get in touch" links: scroll to the hero card and focus its input
 */

export function initExperience(root: HTMLElement): () => void {
  const list = root.querySelector<HTMLElement>("[data-experience]");
  if (!list) return () => {};
  const controller = new AbortController();
  const { signal } = controller;
  const tabs = [...list.querySelectorAll<HTMLElement>("[role=tab]")];

  const select = (tab: HTMLElement): void => {
    for (const other of tabs) {
      const on = other === tab;
      other.setAttribute("aria-selected", String(on));
      other.tabIndex = on ? 0 : -1;
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener(
      "click",
      (event) => {
        // the "Read the write-up" link inside an open panel navigates; anything else selects
        if ((event.target as HTMLElement).closest("a")) return;
        select(tab);
      },
      { signal },
    );
    tab.addEventListener(
      "keydown",
      (event) => {
        const moves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        let next: HTMLElement | undefined;
        if (event.key in moves) next = tabs[(index + moves[event.key] + tabs.length) % tabs.length];
        else if (event.key === "Home") next = tabs[0];
        else if (event.key === "End") next = tabs[tabs.length - 1];
        else if (event.key === "Enter" || event.key === " ") next = tab;
        if (!next) return;
        event.preventDefault();
        select(next);
        next.focus();
      },
      { signal },
    );
  });

  return () => controller.abort();
}

/** Links to `#contact` scroll to the hero card and put the cursor in its input (also on load with that hash). */
export function wireContactLinks(root: HTMLElement, inputSelector: string): () => void {
  const controller = new AbortController();
  const { signal } = controller;
  const target = document.getElementById("contact");
  const input = document.querySelector<HTMLElement>(inputSelector);
  if (!target) return () => {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = 0;
  const go = (): void => {
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    window.clearTimeout(timer);
    timer = window.setTimeout(() => input?.focus({ preventScroll: true }), reduced ? 0 : 650);
  };
  for (const link of root.querySelectorAll<HTMLAnchorElement>('a[href$="#contact"]')) {
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        go();
      },
      { signal },
    );
  }
  if (window.location.hash === "#contact") window.setTimeout(go, 50);
  return () => {
    controller.abort();
    window.clearTimeout(timer);
  };
}
