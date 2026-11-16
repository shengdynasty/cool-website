/** Shape of public/home/hero-grid.json (built by scripts/build-hero-grid.mjs). Same format as the source site's grid, plus `c` and `seam`. */
export interface HeroGrid {
  cols: number;
  rows: number;
  /** cols*rows chars '0'-'9': background glyph density per cell */
  g: string;
  /** cols*rows chars '0'-'9': figure density per cell, '0' outside the figure */
  f: string;
  /** ordered cell indices tracing the figure outline: crown → left side → bottom → right side → crown */
  o: number[];
  /** intro centre as [x, y] fractions of the grid (the figure clears outward from here). Defaults to [0.46, 0.47]. */
  c?: [number, number];
  /** glyph-field seam as fractions of the width, [top rows, lower rows]. Defaults to [0.405, 0.335]. */
  seam?: [number, number];
  /** 2x-resolution sprite over the figure bbox. v: '0' empty, '1'-'9' fill level, 'a'-'i' boundary level 1-9 */
  p: { x: number; y: number; w: number; h: number; s: number; v: string };
}
