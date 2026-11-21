/**
 * A muted loop laid over a cover or figure still, which is its poster. subpage-effects.ts plays it only while it is in
 * view and never under reduced motion, so the still shows before JS, under reduced motion, off screen and wherever the
 * clip can't load. `preload="none"`: nothing downloads until it plays. The WebM goes first when there is one (it is the
 * smaller file); browsers without VP9 fall through to the H.264 MP4.
 */
export function LoopClip({ poster, mp4, webm }: { poster: string; mp4: string; webm?: string }) {
  return (
    <video className="loop-clip" poster={poster} muted loop playsInline preload="none" aria-hidden="true">
      {webm ? <source src={webm} type="video/webm" /> : null}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
