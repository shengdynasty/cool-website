/**
 * Subpage-only behaviour, framework-free so the static artifact build can run it:
 * - list filters (source: framer-motion `PostsExplorer`: spring pill, cards fade/slide in)
 * - copy buttons on code blocks (source: `CopyButton`, "Copied" for 1800ms)
 * - the reading-progress bar under the nav (source: `ScrollProgress`, useScroll + useSpring 120/30)
 * - figure loop clips (`video.loop-clip`): played while in view, left on their still under reduced motion
 */
export function initSubpageEffects(root: HTMLElement): () => void {
  const controller = new AbortController();
  const { signal } = controller;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timers = new Set<number>();
  let progressFrame = 0;
  let disposed = false;

  // ---------------------------------------------------------------- filters
  /** Cards come in from 14px below, fading up (source transition: .35s, ease [.22,1,.36,1]). */
  const enter = (cards: HTMLElement[]): void => {
    for (const card of cards) card.classList.add("enter");
    if (reduced) {
      for (const card of cards) card.classList.remove("enter");
      return;
    }
    // Force a style flush so the transition runs from the "enter" state.
    void root.offsetHeight;
    requestAnimationFrame(() => {
      for (const card of cards) card.classList.remove("enter");
    });
  };

  for (const group of root.querySelectorAll<HTMLElement>("[data-filter-group]")) {
    const grid = document.getElementById(group.dataset.filterGroup ?? "");
    if (!grid) continue;
    const buttons = [...group.querySelectorAll<HTMLButtonElement>("button[data-filter]")];
    const cards = [...grid.querySelectorAll<HTMLElement>(".post-wrap")];
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.setAttribute("aria-hidden", "true");
    group.prepend(pill);
    let active = buttons.find((b) => b.getAttribute("aria-pressed") === "true") ?? buttons[0];

    const placePill = (instant: boolean): void => {
      if (!active) return;
      pill.style.transition = instant || reduced ? "none" : "";
      pill.style.width = `${active.offsetWidth}px`;
      pill.style.height = `${active.offsetHeight}px`;
      pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    };
    const apply = (button: HTMLButtonElement): void => {
      active = button;
      const value = button.dataset.filter ?? "All";
      for (const b of buttons) b.setAttribute("aria-pressed", String(b === button));
      placePill(false);
      const shown: HTMLElement[] = [];
      for (const card of cards) {
        const match = value === "All" || card.dataset.category === value;
        card.hidden = !match;
        if (match) shown.push(card);
      }
      enter(shown);
    };

    for (const button of buttons) button.addEventListener("click", () => apply(button), { signal });
    placePill(true);
    enter(cards);
    window.addEventListener("resize", () => placePill(true), { signal });
  }

  // ---------------------------------------------------------------- copy buttons
  for (const button of root.querySelectorAll<HTMLButtonElement>("button[data-copy]")) {
    const target = document.getElementById(button.dataset.copy ?? "");
    const label = button.querySelector("span") ?? button;
    if (!target) continue;
    const resting = label.textContent ?? "Copy";
    const flash = (text: string): void => {
      label.textContent = text;
      const id = window.setTimeout(() => {
        timers.delete(id);
        label.textContent = resting;
      }, 1800);
      timers.add(id);
    };
    button.addEventListener(
      "click",
      () => {
        const text = target.textContent ?? "";
        // writeText must be called inside the click handler; some frames refuse it, so fall back to selecting.
        navigator.clipboard?.writeText(text).then(
          () => flash("Copied"),
          () => {
            const range = document.createRange();
            range.selectNodeContents(target);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            flash("Selected");
          },
        );
      },
      { signal },
    );
  }

  // ---------------------------------------------------------------- reading progress
  const bar = document.querySelector<HTMLElement>(".scroll-progress");
  if (bar) {
    let value = 0;
    let velocity = 0;
    let target = 0;
    let last = 0;
    const measure = (): number => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    // Damped spring (stiffness 120, damping 30, mass 1), integrated per frame like framer's useSpring.
    const step = (now: number): void => {
      progressFrame = 0;
      if (disposed) return;
      const dt = Math.min(0.064, last ? (now - last) / 1000 : 0.016);
      last = now;
      const force = -120 * (value - target) - 30 * velocity;
      velocity += force * dt;
      value += velocity * dt;
      if (Math.abs(value - target) < 0.001 && Math.abs(velocity) < 0.001) {
        value = target;
        velocity = 0;
        last = 0;
      } else {
        progressFrame = requestAnimationFrame(step);
      }
      bar.style.transform = `scaleX(${value.toFixed(4)})`;
    };
    const onScroll = (): void => {
      target = measure();
      if (reduced) {
        bar.style.transform = `scaleX(${target.toFixed(4)})`;
        return;
      }
      if (!progressFrame) progressFrame = requestAnimationFrame(step);
    };
    window.addEventListener("scroll", onScroll, { passive: true, signal });
    window.addEventListener("resize", onScroll, { signal });
    onScroll();
  }

  // ---------------------------------------------------------------- loop clips
  // A figure's muted loop plays only while it is in view, and never under reduced motion: the still underneath stays.
  const clips = [...root.querySelectorAll<HTMLVideoElement>("video.loop-clip")];
  let clipWatcher: IntersectionObserver | null = null;
  if (clips.length && !reduced && typeof IntersectionObserver === "function") {
    clipWatcher = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const clip = entry.target as HTMLVideoElement;
          if (!entry.isIntersecting) {
            clip.pause();
            continue;
          }
          // set here too: the prerendered markup may lack the attribute, and only muted video may autoplay
          clip.muted = true;
          clip.play().catch(() => {});
        }
      },
      { threshold: 0.25 },
    );
    for (const clip of clips) clipWatcher.observe(clip);
  }

  return () => {
    disposed = true;
    controller.abort();
    clipWatcher?.disconnect();
    for (const clip of clips) clip.pause();
    cancelAnimationFrame(progressFrame);
    for (const id of timers) window.clearTimeout(id);
    timers.clear();
  };
}
