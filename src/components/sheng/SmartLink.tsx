import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

/**
 * Internal paths use next/link (client-side navigation, as the source site does); anything else
 * (other sites, mailto:, in-page #anchors) stays a plain anchor. Both render a plain <a href> in the
 * prerendered HTML, which is what the static artifact build rewrites.
 */
export function SmartLink({ href, children, ...rest }: Props) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
