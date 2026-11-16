/** Small markup helpers shared by the home sections. */

/** Heading words for the decrypt effect: each word is its own `.word` span, separated by plain spaces (source markup). */
export function Words({ words, accent }: { words: readonly string[]; accent?: number }) {
  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className={i === accent ? "word accent" : "word"} aria-hidden="true">
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

/** Link attributes for off-site targets (same as the source footer's social links). */
export function external(isExternal?: boolean) {
  return isExternal ? { target: "_blank", rel: "noopener" } : {};
}
