"use client";

import { useEffect, useRef } from "react";
import { initPortraitMark } from "./portrait-engine";

export interface PortraitMarkProps {
  /** RGBA cutout: grey photo in RGB, Vision person mask in alpha. 900×600 (3:2). */
  src: string;
  /** Plain B&W photo shown when JS is off. */
  fallbackSrc: string;
  alt: string;
  /** CSS font-family string for JetBrains Mono. */
  mono: string;
}

/** The status section's ASCII portrait (replaces the source's "ultrastack" wordmark canvas). */
export function PortraitMark({ src, fallbackSrc, alt, mono }: PortraitMarkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return initPortraitMark(canvas, { src, mono });
  }, [src, mono]);

  return (
    <div className="ultra ascii-portrait">
      <canvas ref={canvasRef} role="img" aria-label={alt} />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ultra-plain" src={fallbackSrc} alt="" aria-hidden="true" width={1086} height={724} />
      </noscript>
    </div>
  );
}
