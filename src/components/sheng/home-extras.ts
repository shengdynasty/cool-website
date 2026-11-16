/**
 * Home-page extras, framework-free so the static artifact build can run them (which is also why this file
 * imports nothing from the other engines):
 * - the experience accordion (aumsuthar.com's design: a row of panels, the selected one grows 7×) and its motion:
 *   the panels rise in one by one when the row scrolls into view and the first one opens; an opening panel's
 *   photo develops out of an ink-and-glyph field (the project covers' dissolve, in this section's colours); and
 *   the row moves on to the next panel every few seconds, with a green countdown line along the open panel's
 *   bottom edge, until the visitor clicks or uses the keyboard on it
 * - "get in touch" links: scroll to the hero card and focus its input
 */

/** Noise characters, as in the other glyph effects. */
const NOISE = ".:/{}<>=#";
const INK = "#000000";
/** MailZoo green: glyphs on the dissolving edge of the develop field, and the countdown line (CSS). */
const LIT = "#2CA942";
/** Resting glyph colour in the develop field. */
const DIM = "rgba(245, 242, 234, .45)";
/** The page's rise easing (home.css `[data-rise]`). */
const RISE = "cubic-bezier(.22, 1, .36, 1)";
/** How long an open panel stays before the row moves on, in ms. */
const DWELL = 6000;
/** The develop field clears over this long; the panel's grow transition is 500ms. */
const DEVELOP_MS = 700;
/** The selected panel's flex-grow (site.css `.xp[aria-selected=true]`). */
const GROW = 7;

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
/** Deterministic pseudo-random value in [0, 1) for a cell (classic sin hash). */
const hash2 = (x: number, y: number): number => {
  const value = 43758.5453 * Math.sin(127.1 * x + 311.7 * y);
  return value - Math.floor(value);
};

export function initExperience(root: HTMLElement, mono: string): () => void {
  const list = root.querySelector<HTMLElement>("[data-experience]");
  if (!list) return () => {};
  const controller = new AbortController();
  const { signal } = controller;
  const tabs = [...list.querySelectorAll<HTMLElement>("[role=tab]")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /** Phone layout (site.css): the panels stack and open by height, so the row never advances on its own there. */
  const stacked = window.matchMedia("(max-width: 640px)");
  const animations = typeof list.animate === "function";
  let disposed = false;
  const timeouts = new Set<number>();
  const later = (callback: () => void, delay: number): void => {
    const id = window.setTimeout(() => {
      timeouts.delete(id);
      if (!disposed) callback();
    }, delay);
    timeouts.add(id);
  };
  const selected = (): HTMLElement | undefined => tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
  /** Watches for the row scrolling into view before the entrance (see the end of this function). */
  let entrance: IntersectionObserver | null = null;

  // ---- develop: the opening panel's photo appears through a dissolving ink-and-glyph field
  let developFrame = 0;
  let developing: HTMLCanvasElement | null = null;
  const stopDevelop = (): void => {
    cancelAnimationFrame(developFrame);
    developFrame = 0;
    if (developing) developing.hidden = true;
    developing = null;
  };
  const develop = (tab: HTMLElement): void => {
    stopDevelop();
    const canvas = tab.querySelector<HTMLCanvasElement>("canvas.xp-dev");
    if (!canvas || reduced) return;
    // The canvas is laid out at the panel's open size and clipped by the panel while it grows, so the field
    // doesn't stretch with it. In the row the open width is the row's share 7:1:…:1 once the gaps are taken out.
    if (!stacked.matches) {
      const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
      const open = ((list.clientWidth - gap * (tabs.length - 1)) * GROW) / (GROW + tabs.length - 1);
      list.style.setProperty("--xp-open", `${Math.round(open)}px`);
    }
    canvas.hidden = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx || width === 0 || height === 0) {
      canvas.hidden = true;
      return;
    }
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cell = width > 400 ? 12 : 8;
    const cols = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    const draw = (threshold: number): void => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `500 ${cell}px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Highest on the left: as the threshold rises, cells clear from the right edge inward, raggedly.
          const value = 0.55 * hash2(col, row) + 0.45 * (1 - col / cols);
          if (value < threshold) continue;
          ctx.fillStyle = INK;
          ctx.fillRect(col * cell, row * cell, cell, cell);
          if (hash2(row, col) < 0.5) {
            // Cells about to clear show a lit glyph.
            ctx.fillStyle = value - threshold < 0.12 ? LIT : DIM;
            ctx.fillText(
              NOISE[Math.floor(hash2(col + 5, row) * NOISE.length)],
              col * cell + cell / 2,
              row * cell + cell / 2,
            );
          }
        }
      }
    };
    developing = canvas;
    const startAt = performance.now();
    const step = (now: number): void => {
      developFrame = 0;
      if (disposed || developing !== canvas) return;
      const progress = clamp((now - startAt) / DEVELOP_MS);
      draw(1.02 * easeOutCubic(progress));
      if (progress < 1) developFrame = requestAnimationFrame(step);
      else stopDevelop();
    };
    draw(0);
    developFrame = requestAnimationFrame(step);
  };

  // ---- autoplay: the row moves on every DWELL ms; the open panel's countdown line fills left to right meanwhile
  let bar: Animation | null = null;
  /** The visitor clicked or used the keyboard: the row stays where they put it. */
  let manual = false;
  let hovered = false;
  let focused = false;
  let shown = false;
  /** Paused while the pointer or focus is on the row, the row is off screen, or the tab is in the background. */
  const syncBar = (): void => {
    if (!bar) return;
    const hold = hovered || focused || !shown || document.hidden;
    if (hold && bar.playState === "running") bar.pause();
    else if (!hold && bar.playState === "paused") bar.play();
  };
  const schedule = (tab: HTMLElement): void => {
    bar?.cancel();
    bar = null;
    if (manual || reduced || stacked.matches || !animations) return;
    const line = tab.querySelector<HTMLElement>(".xp-timer");
    if (!line) return;
    bar = line.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
      duration: DWELL,
      easing: "linear",
      fill: "forwards",
    });
    bar.onfinish = () => {
      if (!disposed) select(tabs[(tabs.indexOf(tab) + 1) % tabs.length]);
    };
    syncBar();
  };
  const takeOver = (): void => {
    manual = true;
    list.classList.add("manual");
    bar?.cancel();
    bar = null;
    entrance?.disconnect();
    delete list.dataset.pending;
  };

  const select = (tab: HTMLElement): void => {
    if (tab.getAttribute("aria-selected") === "true") return;
    for (const other of tabs) {
      const on = other === tab;
      other.setAttribute("aria-selected", String(on));
      other.tabIndex = on ? 0 : -1;
    }
    develop(tab);
    schedule(tab);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener(
      "click",
      (event) => {
        // the "Read the write-up" link inside an open panel navigates; anything else selects
        if ((event.target as HTMLElement).closest("a")) return;
        takeOver();
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
        takeOver();
        select(next);
        next.focus();
      },
      { signal },
    );
  });
  list.addEventListener("pointerenter", () => ((hovered = true), syncBar()), { signal });
  list.addEventListener("pointerleave", () => ((hovered = false), syncBar()), { signal });
  list.addEventListener("focusin", () => ((focused = true), syncBar()), { signal });
  list.addEventListener(
    "focusout",
    (event) => {
      if (list.contains(event.relatedTarget as Node | null)) return;
      focused = false;
      syncBar();
    },
    { signal },
  );
  document.addEventListener("visibilitychange", syncBar, { signal });
  const watcher = new IntersectionObserver(
    (entries) => {
      shown = entries[0].isIntersecting;
      syncBar();
    },
    { threshold: 0.3 },
  );
  watcher.observe(list);
  stacked.addEventListener(
    "change",
    () => {
      const tab = selected();
      if (tab) schedule(tab);
    },
    { signal },
  );

  // ---- entrance: when the row is still below the fold, it waits there hidden; as it scrolls into view the panels
  // rise in one by one, then the first opens. (Already in view, as with a #experience link: it shows as rendered.)
  const enter = (): void => {
    entrance?.disconnect();
    entrance = null;
    delete list.dataset.pending;
    tabs.forEach((tab, i) => {
      tab.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }], {
        duration: 560,
        delay: 55 * i,
        easing: RISE,
        fill: "backwards",
      });
    });
    later(() => select(tabs[0]), 55 * (tabs.length - 1) + 160);
  };
  if (!reduced && animations && list.getBoundingClientRect().top > window.innerHeight * 0.86) {
    list.dataset.pending = "";
    for (const tab of tabs) tab.setAttribute("aria-selected", "false");
    entrance = new IntersectionObserver(
      (entries) => {
        if (disposed || !entries[0].isIntersecting) return;
        enter();
      },
      { rootMargin: "0px 0px -14% 0px" },
    );
    entrance.observe(list);
  } else {
    const tab = selected();
    if (tab) schedule(tab);
  }

  return () => {
    disposed = true;
    controller.abort();
    entrance?.disconnect();
    watcher.disconnect();
    bar?.cancel();
    bar = null;
    stopDevelop();
    for (const id of timeouts) window.clearTimeout(id);
    timeouts.clear();
  };
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
