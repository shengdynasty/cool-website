import { ways } from "@/content/home";
import { Words } from "./markup";

/** The cream "paper" sheet: the two-ways graph. */
export function Sheet() {
  return (
    <div className="sheet">
      <canvas className="seam" data-seam="#F5F2EA" aria-hidden="true" />

      <section className="pad ways-section">
        <h2 className="h2" data-decrypt="true" aria-label={ways.headingAria}>
          <Words words={ways.headingWords} />
        </h2>
        <div className="ways" id="ways">
          <svg className="graph" aria-hidden="true">
            <path id="g-base-a" className="g-base" />
            <path id="g-base-b" className="g-base" />
            <path id="g-a" className="g-line" pathLength={1} />
            <path id="g-b" className="g-line" pathLength={1} />
          </svg>
          <div className="way" id="way-a">
            <span className="branch">{ways.a.branch}</span>
            <h3>{ways.a.title}</h3>
            <p>{ways.a.body}</p>
          </div>
          <div className="way" id="way-b">
            <span className="branch">{ways.b.branch}</span>
            <h3>{ways.b.title}</h3>
            <p>{ways.b.body}</p>
          </div>
          <div className="ships-wrap">
            <p className="ships-title" id="merge-at">
              {ways.shipsTitle}
            </p>
            <ol className="ships" id="ships">
              {ways.ships.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li className="live">{ways.live}</li>
            </ol>
          </div>
        </div>
      </section>

    </div>
  );
}
