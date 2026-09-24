/** WCAG 2.x contrast ratio between two #rrggbb colours. */
export function contrast(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** "AA" for normal text (4.5), "AA large" for 24px+/graphics (3), else "fail". */
export function grade(ratio: number): 'AA' | 'AA large' | 'fail' {
  return ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'fail';
}
