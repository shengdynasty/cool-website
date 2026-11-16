import type { Metadata } from "next";
import { Subpage } from "@/components/sheng/Subpage";
import { SmartLink } from "@/components/sheng/SmartLink";

export const metadata: Metadata = { title: "Not found — Sheng Yan", robots: { index: false } };

export default function NotFound() {
  return (
    <Subpage>
      <header className="head pad">
        <canvas className="head-code" id="head-code" aria-hidden="true" />
        <div className="head-grid">
          <div className="head-text">
            <div className="head-meta">
              <span>404</span>
            </div>
            <h1 className="head-title">Nothing at this address.</h1>
            <p className="head-lede">The page moved or never existed. Everything on this site is reachable from the home page.</p>
            <div className="head-action">
              <SmartLink className="ghost" href="/">
                Back to the home page →
              </SmartLink>
            </div>
          </div>
        </div>
      </header>
    </Subpage>
  );
}
