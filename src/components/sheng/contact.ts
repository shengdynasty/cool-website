/**
 * The hero card's note flow on the Next.js site. A capture-phase listener validates the message and
 * email before the hero engine's own submit handler runs its vanish animation; the engine then calls
 * `onIdeaSent`, which posts the note to /api/note. When no backend answers (static hosting), the note
 * is handed to the visitor's mail app instead. The artifact build has its own version of this flow.
 */
import { hero, mailto } from "@/content/home";

export interface NotePayload {
  message: string;
  email: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function postNote(note: NotePayload): Promise<string> {
  let response: Response;
  try {
    response = await fetch("/api/note", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...note, page: window.location.pathname }),
    });
  } catch {
    response = new Response(null, { status: 503 });
  }
  if (response.ok) return hero.card.status.sent;
  if (response.status === 400 || response.status === 429) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? hero.card.status.failed);
  }
  // no backend here: fall back to the visitor's mail app
  window.location.href = mailto(hero.mailSubject, `${note.message}\n\nReply to: ${note.email}`);
  throw new Error(hero.card.status.failed);
}

export function createHeroNote(root: HTMLElement, send: (note: NotePayload) => Promise<string>) {
  const form = root.querySelector<HTMLFormElement>("#hero-form");
  const idea = root.querySelector<HTMLInputElement>("#idea-code");
  const email = root.querySelector<HTMLInputElement>("#idea-email");
  const status = root.querySelector<HTMLElement>("#idea-status");
  const controller = new AbortController();
  const say = (text: string, ok = false): void => {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("ok", ok);
  };

  if (form && idea && email) {
    root.addEventListener(
      "submit",
      (event) => {
        if (event.target !== form) return;
        if (!idea.value.trim()) {
          event.preventDefault();
          event.stopImmediatePropagation();
          say(hero.card.status.needMessage);
          idea.focus();
          return;
        }
        if (!EMAIL.test(email.value.trim())) {
          event.preventDefault();
          event.stopImmediatePropagation();
          say(hero.card.status.needEmail);
          email.focus();
          return;
        }
        say(hero.card.status.sending);
      },
      { capture: true, signal: controller.signal },
    );
  }

  const onIdeaSent = (message: string): void => {
    const address = email?.value.trim() ?? "";
    send({ message, email: address }).then(
      (text) => {
        if (email) email.value = "";
        say(text, true);
      },
      (error: unknown) => say(error instanceof Error ? error.message : hero.card.status.failed),
    );
  };

  return { onIdeaSent, dispose: () => controller.abort() };
}

/** Instant scroll to the top after a client-side page switch (never on the first load, never with a hash). */
let mountedOnce = false;
export function scrollToTopAfterNavigation(): void {
  if (!mountedOnce) {
    mountedOnce = true;
    return;
  }
  if (window.location.hash) return;
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.style.scrollBehavior = previous;
}
